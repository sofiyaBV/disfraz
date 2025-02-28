import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  productId: number;

  @ApiProperty({ example: 1, description: 'ID атрибута' })
  attributeId: number;
}