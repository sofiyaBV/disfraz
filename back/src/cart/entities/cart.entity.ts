import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Імпорт для Swagger
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор елемента кошика',
  })
  id: number;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.carts,
  )
  @JoinColumn({ name: 'productAttributeId' })
  @ApiProperty({
    type: () => ProductAttribute,
    description: 'Зв’язок із продуктом та атрибутом',
  })
  productAttribute: ProductAttribute;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    type: () => User,
    description: 'Користувач, який додав товар до кошика',
  })
  user: User;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({
    example: 1,
    description: 'Кількість даного продукту в кошику',
  })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({ example: 199.99, description: 'Ціна за одиницю товару' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата додавання до кошика',
  })
  addedAt: Date;

  @OneToMany(() => Order, (order) => order.cart)
  @ApiProperty({
    type: () => [Order],
    description: 'Список замовлень, пов’язаних із кошиком',
  })
  orders: Order[];
}
