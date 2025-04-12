import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateProductAttributeDto {
  @ApiProperty({
    example: 1,
    description: 'ID продукту',
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'ID атрибуту',
  })
  @IsInt()
  attributeId: number;

  @ApiProperty({
    example: 'Доступний на складі',
    description: 'Наявність комбінації продукту та атрибуту',
    required: false,
  })
  @IsString()
  @IsOptional()
  inStock?: string;
}
