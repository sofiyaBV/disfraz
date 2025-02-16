import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Костюм супергероя', description: 'Назва товару' })
  name: string;

  @ApiProperty({ example: 199.99, description: 'Ціна товару' })
  price: number;

  @ApiProperty({ example: 'Костюм для косплею', description: 'Опис товару' })
  description: string;

  @ApiProperty({
    example: ['url1.jpg', 'url2.jpg'],
    description: 'Список зображень',
  })
  images: string[];

  @ApiProperty({ example: ['M', 'L', 'XL'], description: 'Розміри' })
  sizes: string[];

  @ApiProperty({ example: ['Шкіра', 'Тканина'], description: 'Матеріали' })
  materials: string[];

  @ApiProperty({ example: 'Фентезі', description: 'Тематика' })
  theme: string;

  @ApiProperty({ example: ['Голова', 'Тіло'], description: 'Частини тіла' })
  bodyParts: string[];

  @ApiProperty({ example: true, description: 'Це комплект?' })
  isSet: boolean;

  @ApiProperty({
    example: 'Додаткова інформація про товар',
    description: 'Додаткові відомості',
  })
  additionalInfo: string;

  @ApiProperty({ example: true, description: 'У наявності?' })
  inStock: boolean;

  @ApiProperty({ example: 10, description: 'Знижка у відсотках' })
  discount: number;

  @ApiProperty({ example: 179.99, description: 'Ціна зі знижкою' })
  discountedPrice: number;
}
