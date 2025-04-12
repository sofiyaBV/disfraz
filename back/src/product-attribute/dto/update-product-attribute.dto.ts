import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateProductAttributeDto {
  @ApiProperty({
    example: 1,
    description: 'Оновлений ID продукту',
    required: false,
  })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({
    example: 1,
    description: 'Оновлений ID атрибута',
    required: false,
  })
  @IsOptional()
  @IsInt()
  attributeId?: number;
}
