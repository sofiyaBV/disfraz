import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
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
    const { currency, description, paymentMethodId } = createPaymentDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Користувача з ID ${userId} не знайдено`);
    }

    const order = await this.orderRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(
        `Замовлення для користувача з ID ${userId} не знайдено`,
      );
    }

    let paymentMethod: Stripe.PaymentMethod;
    try {
      paymentMethod =
        await this.stripe.paymentMethods.retrieve(paymentMethodId);
      if (paymentMethod.type !== 'card') {
        throw new BadRequestException('Метод оплати має бути карткою');
      }
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Невірний метод оплати: ${error.message || 'Невідома помилка'}`,
      );
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
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Помилка при збереженні платежу: ${error.message || 'Невідома помилка'}`,
      );
    }

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.price * 100),
        currency: currency || 'UAH',
        description: description || `Оплата замовлення #${order.id}`,
        metadata: {
          orderId: order.id.toString(),
          paymentId: savedPayment.id.toString(),
        },
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      savedPayment.stripePaymentIntentId = paymentIntent.id;
      savedPayment.status = paymentIntent.status as PaymentStatus;
      await this.paymentRepository.save(savedPayment);
    } catch (error: any) {
      await this.paymentRepository.delete(savedPayment.id);

      const stripeError = error as Stripe.errors.StripeError;

      if (stripeError.type === 'StripeCardError') {
        throw new BadRequestException(
          `Картку відхилено: ${stripeError.message}`,
        );
      }

      if (stripeError.type === 'StripeInvalidRequestError') {
        throw new BadRequestException(`Невірний запит: ${stripeError.message}`);
      }

      throw new InternalServerErrorException(
        `Помилка при створенні платежу: ${error.message || 'Невідома помилка'}`,
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
      throw new InternalServerErrorException('WEBHOOKне налаштовано');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      throw new BadRequestException(`Webhook помилка: ${error.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(
          paymentIntent.id,
          PaymentStatus.SUCCEEDED,
        );
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
}
