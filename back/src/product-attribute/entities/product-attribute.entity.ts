import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Імпорт для Swagger
import { Product } from '../../product/entities/product.entity';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('product_attribute')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор зв’язку продукту з атрибутом',
  })
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes)
  @JoinColumn({ name: 'productId' })
  @ApiProperty({
    type: () => Product,
    description: 'Продукт, пов’язаний із атрибутом',
  })
  product: Product;

  @ManyToOne(() => Attribute, (attribute) => attribute.products)
  @JoinColumn({ name: 'attributeId' })
  @ApiProperty({
    type: () => Attribute,
    description: 'Атрибут, пов’язаний із продуктом',
  })
  attribute: Attribute;

  @OneToMany(() => Cart, (cart) => cart.productAttribute)
  carts: Cart[];

  @OneToMany(() => Comment, (comment) => comment.productAttribute)
  comments: Comment[];
}
