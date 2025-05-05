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
  @ApiProperty({ description: 'Унікальний ідентифікатор платежу', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID замовлення', example: 1 })
  @Column()
  orderId: number;

  @ApiProperty({ description: 'Сума платежу', example: 100.5 })
  @Column()
  amount: number;

  @ApiProperty({ description: 'Валюта платежу', example: 'UAH' })
  @Column()
  currency: string;

  @ApiProperty({ description: 'Статус платежу', example: 'success' })
  @Column()
  status: string;

  @ApiProperty({
    description: 'ID платежу від Stripe',
    example: 'pi_1J2K3L4M5N6O7P8Q',
    required: false,
  })
  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @ApiProperty({
    description: 'Дата створення платежу',
    example: '2025-04-24T12:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Опис платежу',
    example: 'Оплата замовлення #12345',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Останні 4 цифри картки',
    example: '4242',
    required: false,
  })
  @Column({ nullable: true })
  last4: string;

  @ApiProperty({
    description: 'Тип картки (наприклад, visa, mastercard)',
    example: 'visa',
    required: false,
  })
  @Column({ nullable: true })
  cardType: string;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
