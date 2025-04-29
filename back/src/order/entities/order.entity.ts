import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { DeliveryMethod } from '../dto/create-order.dto';
import { Payment } from '../../payment/entities/payment.entity';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор замовлення',
  })
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата створення замовлення',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'Іван Іванов', description: "Ім'я клієнта" })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    example: 'ivan@example.com',
    description: 'Електронна пошта клієнта',
  })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20 })
  @ApiProperty({
    example: '+380991234567',
    description: 'Номер телефону клієнта',
  })
  customerPhone: string;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'вул. Центральна, 1, Київ',
    description: 'Адреса доставки',
  })
  deliveryAddress: string;

  @Column({ type: 'enum', enum: DeliveryMethod })
  @ApiProperty({
    example: 'Нова Пошта - відділення',
    description: 'Спосіб доставки',
    enum: DeliveryMethod,
  })
  deliveryMethod: DeliveryMethod;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Залиште біля дверей',
    description: 'Додаткові примітки до замовлення',
  })
  notes: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  @ApiProperty({ example: 'Pending', description: 'Статус замовлення' })
  status: string;

  @Column('integer', { array: true, default: [] })
  @ApiProperty({
    example: [1, 2],
    description: 'Масив ID продуктів (або атрибутів продуктів) у замовленні',
  })
  productAttributeIds: number[];

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    example: 3,
    description: 'Загальна кількість товарів у замовленні',
  })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({
    example: 999.0,
    description: 'Загальна вартість замовлення',
  })
  price: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
