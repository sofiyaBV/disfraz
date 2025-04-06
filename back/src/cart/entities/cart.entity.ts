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
    description: 'Уникальный идентификатор элемента корзины',
  })
  id: number;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.carts,
  )
  @JoinColumn({ name: 'productAttributeId' })
  @ApiProperty({
    type: () => ProductAttribute,
    description: 'Связь с продуктом и атрибутом',
  })
  productAttribute: ProductAttribute;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    type: () => User,
    description: 'Пользователь, который добавил товар в корзину',
  })
  user: User;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({
    example: 1,
    description: 'Количество данного продукта в корзине',
  })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({ example: 199.99, description: 'Цена за единицу товара' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата добавления в корзину',
  })
  addedAt: Date;
}
