import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Костюм супергероя',
    description: 'Назва товару (опціонально)',
  })
  @IsOptional()
  @IsString({ message: 'Назва товару повинна бути рядком' })
  name?: string;

  @ApiPropertyOptional({
    example: 199.99,
    description: 'Ціна товару (опціонально)',
  })
  @IsOptional()
  @IsNumber({}, { message: 'Ціна товару повинна бути числом' })
  price?: number;

  @ApiPropertyOptional({
    example: 'Костюм для косплею',
    description: 'Опис товару (опціонально)',
  })
  @IsOptional()
  @IsString({ message: 'Опис товару повинен бути рядком' })
  description?: string;

  @ApiPropertyOptional({
    example: [5, 7],
    description: 'Список ID схожих товарів (опціонально)',
  })
  @IsOptional()
  @IsArray({ message: 'Список схожих товарів повинен бути масивом' })
  @IsInt({
    each: true,
    message: 'Кожен ID схожого товару повинен бути цілим числом',
  })
  @Transform(({ value }) => {
    // Если значение - строка, преобразуем её в массив чисел
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => parseInt(item.trim(), 10))
        .filter((item) => !isNaN(item));
    }
    // Если значение уже массив, преобразуем элементы в числа
    if (Array.isArray(value)) {
      return value
        .map((item) => parseInt(item, 10))
        .filter((item) => !isNaN(item));
    }
    return value;
  })
  similarProductIds?: number[];
}
