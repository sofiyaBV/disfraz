import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';
import { User } from '../../user/entities/user.entity';

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
    description: 'Связь з продуктом і атрибутом',
  })
  productAttribute: ProductAttribute;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    type: () => User,
    description: 'Користувач, який додав товар у кошик',
  })
  user: User;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({
    example: 1,
    description: 'Кількість цього продукту в кошику',
  })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({ example: 199.99, description: 'Ціна за одиницю' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата додавання в кошик',
  })
  addedAt: Date;
}
