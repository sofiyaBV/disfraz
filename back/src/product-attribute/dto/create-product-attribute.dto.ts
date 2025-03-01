import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductAttributeDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1, description: 'ID атрибута' })
  @IsInt()
  @IsNotEmpty()
  attributeId: number;
}