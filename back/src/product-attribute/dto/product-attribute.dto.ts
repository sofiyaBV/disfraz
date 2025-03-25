import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeDto {
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор зв’язку продукту з атрибутом',
  })
  id: number;

  @ApiProperty({
    description: 'Продукт, пов’язаний із атрибутом',
  })
  product?: any;

  @ApiProperty({
    description: 'Атрибут, пов’язаний із продуктом',
  })
  attribute?: any;

  @ApiProperty({
    description: 'Список кошиків, пов’язаних із зв’язком',
  })
  carts?: any[];

  @ApiProperty({
    description: 'Список коментарів, пов’язаних із зв’язком',
  })
  comments?: any[];
}
