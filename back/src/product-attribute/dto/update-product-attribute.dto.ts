import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductAttributeDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Новий ID продукту', 
    required: false 
  })
  productId?: number;

  @ApiProperty({ 
    example: 1, 
    description: 'Новий ID атрибута', 
    required: false 
  })
  attributeId?: number;
}