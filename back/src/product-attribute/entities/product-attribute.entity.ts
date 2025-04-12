import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: 'Доступний на складі',
    description: 'Наявність комбінації продукту та атрибуту',
  })
  inStock: string;

  @OneToMany(() => Cart, (cart) => cart.productAttribute)
  carts: Cart[];

  @OneToMany(() => Comment, (comment) => comment.productAttribute)
  comments: Comment[];
}
