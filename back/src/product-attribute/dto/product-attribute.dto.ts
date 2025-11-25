import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';

export class ProductAttributeDto {
  @ApiProperty({
    example: 1,
    description: "Унікальний ідентифікатор зв'язку продукту з атрибутом",
  })
  id: number;

  @ApiProperty({
    description: "Продукт, пов'язаний із атрибутом",
    type: () => Product,
  })
  product?: Product;

  @ApiProperty({
    description: "Атрибут, пов'язаний із продуктом",
    type: () => Attribute,
  })
  attribute?: Attribute;

  @ApiProperty({
    description: "Список кошиків, пов'язаних із зв'язком",
    type: () => [Cart],
  })
  carts?: Cart[];

  @ApiProperty({
    description: "Список коментарів, пов'язаних із зв'язком",
    type: () => [Comment],
  })
  comments?: Comment[];
}
