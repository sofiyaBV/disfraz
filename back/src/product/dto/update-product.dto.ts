import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Костюм супергероя',
    description: 'Назва товару (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Назва товару повинна бути рядком' })
  name?: string;

  @ApiProperty({
    example: 199.99,
    description: 'Ціна товару (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Ціна товару повинна бути числом' })
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price?: number;

  @ApiProperty({
    example: 'Костюм для косплею',
    description: 'Опис товару (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Опис товару повинен бути рядком' })
  description?: string;
}
