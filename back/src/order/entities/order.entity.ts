import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { DeliveryMethod } from '../dto/create-order.dto';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор заказа',
  })
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата создания заказа',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя клиента' })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    example: 'ivan@example.com',
    description: 'Электронная почта клиента',
  })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({
    example: '+380991234567',
    description: 'Номер телефона клиента',
  })
  customerPhone: string;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'ул. Центральная, 1, Киев',
    description: 'Адрес доставки',
  })
  deliveryAddress: string;

  @Column({ type: 'enum', enum: DeliveryMethod })
  @ApiProperty({
    example: 'Новая Почта - отделение',
    description: 'Способ доставки',
    enum: DeliveryMethod,
  })
  deliveryMethod: DeliveryMethod;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Оставьте у двери',
    description: 'Дополнительные заметки к заказу',
  })
  notes: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  @ApiProperty({ example: 'Pending', description: 'Статус заказа' })
  status: string;

  @Column('integer', { array: true, default: [] })
  @ApiProperty({
    example: [1, 2],
    description: 'Массив ID продуктов (или атрибутов продуктов) в заказе',
  })
  productAttributeIds: number[];

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
