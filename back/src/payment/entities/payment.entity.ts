import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Payment {
  @ApiProperty({ description: 'Уникальный идентификатор платежа', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID заказа', example: 'order_12345' })
  @Column()
  orderId: string;

  @ApiProperty({ description: 'Сумма платежа', example: 100.5 })
  @Column()
  amount: number;

  @ApiProperty({ description: 'Валюта платежа', example: 'UAH' })
  @Column()
  currency: string;

  @ApiProperty({ description: 'Статус платежа', example: 'success' })
  @Column()
  status: string;

  @ApiProperty({
    description: 'ID платежа от LiqPay',
    example: 'pay_987654',
    required: false,
  })
  @Column({ nullable: true })
  paymentId: string;

  @ApiProperty({
    description: 'Дата создания платежа',
    example: '2025-04-24T12:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Описание платежа',
    example: 'Оплата заказа #12345',
    required: false,
  })
  @Column({ nullable: true })
  description: string;
}
