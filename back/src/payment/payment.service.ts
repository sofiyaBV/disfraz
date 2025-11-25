import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../order/enums/order-status.enum';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const { orderId, currency, description, paymentMethodId } = createPaymentDto;

    // ВАЖЛИВО: Перевіряємо користувача
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Користувача з ID ${userId} не знайдено`);
    }

    let order: Order;

    // ВАЖЛИВО: Якщо orderId вказано - використовуємо його (явно)
    if (orderId) {
      order = await this.orderRepository.findOne({
        where: { id: orderId, user: { id: userId } },
        relations: ['user'],
      });

      if (!order) {
        throw new NotFoundException(
          `Замовлення з ID ${orderId} не знайдено або не належить користувачу`,
        );
      }
    } else {
      // ВАЖЛИВО: Якщо orderId НЕ вказано - беремо останнє неоплачене замовлення
      const unpaidOrders = await this.orderRepository.find({
        where: { user: { id: userId }, status: 'Pending' },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });

      if (unpaidOrders.length === 0) {
        throw new NotFoundException(
          `У користувача немає неоплачених замовлень. Створіть замовлення перед оплатою.`,
        );
      }

      if (unpaidOrders.length > 1) {
        const orderIds = unpaidOrders.map((o) => o.id).join(', ');
        throw new BadRequestException(
          `У вас кілька неоплачених замовлень (${orderIds}). Будь ласка, вкажіть orderId для оплати конкретного замовлення.`,
        );
      }

      order = unpaidOrders[0];
      this.logger.log(
        `Auto-selected order ${order.id} for user ${userId} payment`,
      );
    }

    // ВАЖЛИВО: Перевіряємо, чи не було вже успішної оплати для цього замовлення
    const existingPayment = await this.paymentRepository.findOne({
      where: {
        orderId: order.id,
        status: PaymentStatus.SUCCEEDED,
      },
    });

    if (existingPayment) {
      throw new BadRequestException(
        `Замовлення #${orderId} вже оплачено. ID платежу: ${existingPayment.id}`,
      );
    }

    let paymentMethod: Stripe.PaymentMethod;
    try {
      paymentMethod =
        await this.stripe.paymentMethods.retrieve(paymentMethodId);
      if (paymentMethod.type !== 'card') {
        throw new BadRequestException('Метод оплати має бути карткою');
      }
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      throw new BadRequestException(`Невірний метод оплати: ${errorMessage}`);
    }

    const payment = this.paymentRepository.create({
      orderId: order.id,
      amount: order.price,
      currency: currency || 'UAH',
      description: description || `Оплата замовлення #${order.id}`,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: null,
      last4: paymentMethod.card?.last4,
      cardType: paymentMethod.card?.brand,
    });

    let savedPayment: Payment;
    try {
      savedPayment = await this.paymentRepository.save(payment);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      throw new InternalServerErrorException(
        `Помилка при збереженні платежу: ${errorMessage}`,
      );
    }

    let paymentIntent: Stripe.PaymentIntent;
    try {
      // ВАЖЛИВО: Додано idempotency_key для запобігання дублікатів
      const idempotencyKey = `order_${order.id}_payment_${savedPayment.id}_${Date.now()}`;

      paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: Math.round(order.price * 100),
          currency: currency || 'UAH',
          description: description || `Оплата замовлення #${order.id}`,
          metadata: {
            orderId: order.id.toString(),
            paymentId: savedPayment.id.toString(),
            userId: userId.toString(),
          },
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
        },
        {
          idempotencyKey: idempotencyKey,
        },
      );

      savedPayment.stripePaymentIntentId = paymentIntent.id;
      savedPayment.status = paymentIntent.status as PaymentStatus;
      await this.paymentRepository.save(savedPayment);

      // ВАЖЛИВО: Якщо оплата успішна - змінюємо статус замовлення
      if (paymentIntent.status === 'succeeded') {
        await this.updateOrderStatus(order.id, OrderStatus.PAID);
        this.logger.log(
          `Order ${order.id} status changed to PAID after successful payment`,
        );
      }
    } catch (error: unknown) {
      await this.paymentRepository.delete(savedPayment.id);

      if (error instanceof Error && 'type' in error) {
        const stripeError = error as Stripe.errors.StripeError;

        if (stripeError.type === 'StripeCardError') {
          throw new BadRequestException(
            `Картку відхилено: ${stripeError.message}`,
          );
        }

        if (stripeError.type === 'StripeInvalidRequestError') {
          throw new BadRequestException(
            `Невірний запит: ${stripeError.message}`,
          );
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      throw new InternalServerErrorException(
        `Помилка при створенні платежу: ${errorMessage}`,
      );
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: savedPayment.id,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      requiresAction: paymentIntent.status === 'requires_action',
      nextAction: paymentIntent.next_action,
    };
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Платіж з ID ${id} не знайдено`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (updatePaymentDto.amount && updatePaymentDto.amount !== payment.amount) {
      throw new BadRequestException(
        'Оновлення суми платежу не допускається після створення',
      );
    }

    await this.paymentRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.paymentRepository.delete(id);
    return { message: `Платіж #${id} видалено` };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new InternalServerErrorException('WEBHOOK не налаштовано');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Невідома помилка';
      throw new BadRequestException(`Webhook помилка: ${errorMessage}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(
          paymentIntent.id,
          PaymentStatus.SUCCEEDED,
        );

        // ВАЖЛИВО: Змінюємо статус замовлення при успішній оплаті через webhook
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          await this.updateOrderStatus(parseInt(orderId), OrderStatus.PAID);
          this.logger.log(
            `Order ${orderId} status changed to PAID via webhook`,
          );
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(paymentIntent.id, PaymentStatus.FAILED);
        break;
      }
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(
          paymentIntent.id,
          PaymentStatus.CANCELED,
        );
        break;
      }
      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(
          paymentIntent.id,
          PaymentStatus.PROCESSING,
        );
        break;
      }
    }

    return { received: true };
  }

  private async updatePaymentStatus(
    stripePaymentIntentId: string,
    status: PaymentStatus,
  ) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId },
    });

    if (payment) {
      payment.status = status;
      await this.paymentRepository.save(payment);
    }
  }

  // ВАЖЛИВО: Допоміжний метод для зміни статусу замовлення
  private async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (order) {
      const oldStatus = order.status;
      order.status = status;
      await this.orderRepository.save(order);
      this.logger.log(
        `Order ${orderId} status updated: ${oldStatus} -> ${status}`,
      );
    } else {
      this.logger.warn(
        `Cannot update order ${orderId} status - order not found`,
      );
    }
  }
}
