import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as LiqPay from 'liqpay';

@Injectable()
export class PaymentService {
  private liqpay: any;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    const publicKey = process.env.LIQPAY_PUBLIC_KEY;
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;
    this.liqpay = LiqPay(publicKey, privateKey);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, amount, currency, description } = createPaymentDto;

    const payment = this.paymentRepository.create({
      orderId,
      amount,
      currency,
      description,
      status: 'pending',
    });
    await this.paymentRepository.save(payment);

    const data = {
      action: 'pay',
      amount: amount.toString(),
      currency: currency || 'UAH',
      description: description || `Оплата заказа #${orderId}`,
      order_id: orderId,
      version: '3',
      sandbox: '1',
      result_url: 'http://localhost:3000/result_url',
      server_url: 'http://localhost:3000/callback',
    };

    const { data: liqpayData, signature } = this.liqpay.cnb_object(data);

    return { data: liqpayData, signature, paymentId: payment.id };
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
    return { message: `Платеж #${id} удален` };
  }

  async handleCallback(data: any, signature: string) {
    const isValid = this.liqpay.verify(signature, data);
    if (!isValid) {
      throw new Error('Неверная подпись');
    }

    const decodedData = JSON.parse(
      Buffer.from(data, 'base64').toString('utf-8'),
    );
    const { order_id, status, payment_id } = decodedData;

    const payment = await this.paymentRepository.findOneBy({
      orderId: order_id,
    });
    if (payment) {
      payment.status = status;
      payment.paymentId = payment_id;
      await this.paymentRepository.save(payment);
    }

    return { status: 'ok' };
  }
}
