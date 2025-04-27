import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Payment {
  @ApiProperty({ description: 'Уникальный идентификатор платежа', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID заказа', example: 1 })
  @Column()
  orderId: number;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

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
    description: 'ID платежа от Stripe',
    example: 'pi_1J2K3L4M5N6O7P8Q',
    required: false,
  })
  @Column({ nullable: true })
  stripePaymentIntentId: string;

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
