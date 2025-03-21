import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';

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
  price?: number;

  @ApiProperty({
    example: 'Костюм для косплею',
    description: 'Опис товару (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Опис товару повинен бути рядком' })
  description?: string;

  @ApiProperty({
    example: ['url1.jpg', 'url2.jpg'],
    description: 'Список зображень (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Список зображень повинен бути масивом' })
  @IsString({
    each: true,
    message: 'Кожен елемент списку зображень повинен бути рядком',
  })
  images?: string[];

  @ApiProperty({
    example: [5, 7],
    description: 'Список ID схожих товарів (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Список схожих товарів повинен бути масивом' })
  @IsInt({
    each: true,
    message: 'Кожен ID схожого товару повинен бути цілим числом',
  })
  similarProducts?: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Список ID атрибутів товару (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Список ID атрибутів повинен бути масивом' })
  @IsInt({ each: true, message: 'Кожен ID атрибуту повинен бути цілим числом' })
  attributeIds?: number[];
}
