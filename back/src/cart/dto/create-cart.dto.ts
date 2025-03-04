import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID атрибута товару (зв’язок із product_attribute)',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productAttributeId: number;

  @ApiProperty({
    description: 'ID користувача (зв’язок із user)',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiPropertyOptional({
    description: 'Кількість товару в кошику',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number = 1; // За замовчуванням 1, як у сутності

  @ApiPropertyOptional({
    description: 'Ціна за одиницю товару',
    example: 199.99,
    default: 0.00,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number = 0.00; // За замовчуванням 0.00, як у сутності
}