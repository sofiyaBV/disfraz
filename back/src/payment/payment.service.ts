import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { Order } from '../order/entities/order.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil', // Исправляем на актуальную версию
    });
  }

  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const { amount, currency, description } = createPaymentDto;

    // Находим последний заказ пользователя
    const order = await this.orderRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }, // Сортируем по дате создания (последний заказ)
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(
        `Заказ для пользователя с ID ${userId} не найден`,
      );
    }

    const payment = this.paymentRepository.create({
      orderId: order.id,
      amount,
      currency: currency || 'UAH',
      description: description || `Оплата заказа #${order.id}`,
      status: 'pending',
    });
    await this.paymentRepository.save(payment);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe ожидает сумму в копейках
      currency: currency || 'UAH',
      description: description || `Оплата заказа #${order.id}`,
      metadata: { orderId: order.id.toString(), paymentId: payment.id },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Отключаем методы оплаты с перенаправлением
      },
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    await this.paymentRepository.save(payment);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      stripePaymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { stripePaymentIntentId, paymentMethodId } = confirmPaymentDto;

    // Находим платеж в базе
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId },
    });

    if (!payment) {
      throw new NotFoundException('Платёж не найден');
    }

    if (payment.status !== 'pending') {
      throw new Error('Платёж уже обработан');
    }

    try {
      // Подтверждаем PaymentIntent, используя переданный paymentMethodId
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        stripePaymentIntentId,
        {
          payment_method: paymentMethodId,
        },
      );

      // Обновляем статус платежа в базе в зависимости от результата
      if (paymentIntent.status === 'succeeded') {
        payment.status = 'success';
      } else if (paymentIntent.status === 'requires_payment_method') {
        payment.status = 'failed';
      } else {
        payment.status = 'pending'; // Для других статусов (например, requires_action)
      }

      await this.paymentRepository.save(payment);

      return {
        paymentId: payment.id,
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error: any) {
      payment.status = 'failed';
      await this.paymentRepository.save(payment);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Ошибка при подтверждении платежа: ${errorMessage}`);
    }
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Платёж с ID ${id} не найден`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    await this.paymentRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    await this.paymentRepository.delete(id);
    return { message: `Платеж #${id} удалён` };
  }

  async handleCallback(data: { paymentIntentId: string; status: string }) {
    const { paymentIntentId, status } = data;

    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      throw new NotFoundException('Платёж не найден');
    }

    payment.status = status;
    await this.paymentRepository.save(payment);

    return { status: 'ok' };
  }
}
