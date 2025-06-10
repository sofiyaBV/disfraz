import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
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
        throw new Error('Метод оплати має бути карткою');
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Помилка при отриманні методу оплати: ${errorMessage}`);
    }

    const payment = this.paymentRepository.create({
      orderId: order.id,
      amount: order.price,
      currency: currency || 'UAH',
      description: description || `Оплата замовлення #${order.id}`,
      status: 'pending',
      stripePaymentIntentId: null,
      last4: paymentMethod.card?.last4,
      cardType: paymentMethod.card?.brand,
    });

    let savedPayment: Payment;
    try {
      savedPayment = await this.paymentRepository.save(payment);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Помилка при збереженні платежу: ${errorMessage}`);
    }

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.price * 100), // Використовуємо order.price
        currency: currency || 'UAH',
        description: description || `Оплата замовлення #${order.id}`,
        metadata: { orderId: order.id.toString(), paymentId: savedPayment.id },
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      savedPayment.stripePaymentIntentId = paymentIntent.id;
      savedPayment.status = paymentIntent.status;
      await this.paymentRepository.save(savedPayment);
    } catch (error: any) {
      await this.paymentRepository.delete(savedPayment.id);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Помилка при створенні PaymentIntent: ${errorMessage}`);
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: savedPayment.id,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
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
      throw new Error('Оновлення суми платежу не допускається після створення');
    }

    await this.paymentRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    await this.paymentRepository.delete(id);
    return { message: `Платіж #${id} видалено` };
  }

  async handleCallback(data: { paymentIntentId: string }) {
    const { paymentIntentId } = data;

    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId є обов’язковим');
    }

    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      throw new NotFoundException('Платіж не знайдено');
    }

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      throw new BadRequestException(
        `Помилка при отриманні PaymentIntent: ${error.message}`,
      );
    }

    payment.status = paymentIntent.status;
    await this.paymentRepository.save(payment);

    return payment;
  }
}
