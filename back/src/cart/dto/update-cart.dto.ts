import { IsInt, IsPositive, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description:
      'ID зв’язку продукту та атрибуту (з таблиці product_attribute)',
    example: 1,
    required: false,
  })
  productAttributeId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Кількість даного продукту/атрибуту в кошику',
    example: 2,
    required: false,
  })
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Ціна за одиницю (опціонально, може бути обчислена сервером)',
    example: 199.99,
    required: false,
  })
  price?: number;
}
