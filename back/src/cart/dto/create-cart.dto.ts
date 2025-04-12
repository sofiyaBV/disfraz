import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID атрибута товара (связь с product_attribute)',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productAttributeId: number;

  @ApiPropertyOptional({
    description: 'Кількість товарів у кошику',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number = 1;

  @ApiPropertyOptional({
    description: 'Ціна за одиницю',
    example: 199.99,
    default: 0.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number = 0.0;
}
