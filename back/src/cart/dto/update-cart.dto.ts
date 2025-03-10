import { IsInt, IsPositive, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'ID связи продукта и атрибута (из таблицы product_attribute)',
    example: 1,
    required: false,
  })
  productAttributeId?: number; // ID связи продукт-атрибут

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Количество данного продукта/атрибута в корзине',
    example: 2,
    required: false,
  })
  quantity?: number; // Количество

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Цена за единицу (опционально, может быть вычислена сервером)',
    example: 199.99,
    required: false,
  })
  price?: number; // Цена (опционально, может быть вычислена сервером)
}
