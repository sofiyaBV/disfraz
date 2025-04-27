import { Injectable } from '@nestjs/common';
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

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, amount, currency, description } = createPaymentDto;

    // Проверяем, существует ли заказ с указанным orderId
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new Error(`Заказ с ID ${orderId} не найден`);
    }

    const payment = this.paymentRepository.create({
      orderId,
      amount,
      currency: currency || 'UAH',
      description: description || `Оплата заказа #${orderId}`,
      status: 'pending',
    });
    await this.paymentRepository.save(payment);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe ожидает сумму в копейках
      currency: currency || 'UAH',
      description: description || `Оплата заказа #${orderId}`,
      metadata: { orderId: orderId.toString(), paymentId: payment.id },
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
    const payment = await this.paymentRepository.findOneBy({
      stripePaymentIntentId,
    });

    if (!payment) {
      throw new Error('Платёж не найден');
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
    return this.paymentRepository.findOneBy({ id });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.update(id, updatePaymentDto);
    return this.paymentRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.paymentRepository.delete(id);
    return { message: `Платеж #${id} удалён` };
  }

  async handleCallback(data: { paymentIntentId: string; status: string }) {
    const { paymentIntentId, status } = data;

    const payment = await this.paymentRepository.findOneBy({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!payment) {
      throw new Error('Платёж не найден');
    }

    payment.status = status;
    await this.paymentRepository.save(payment);

    return { status: 'ok' };
  }
}
