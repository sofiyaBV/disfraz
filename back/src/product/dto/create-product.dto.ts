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

  @ApiProperty({
    example: [5, 7],
    description: 'Список ID схожих товарів',
  })
  similarProducts: number[]; // Масив ID схожих товарів
}
