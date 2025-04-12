import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    example: 'Доступний на складі',
    description:
      'Значення для наявності (наприклад, «Доступний на складі», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Наявність повинна бути рядком' })
  inStock?: string;
}
