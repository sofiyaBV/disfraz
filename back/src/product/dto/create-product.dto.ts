import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'Костюм супергероя',
    description: 'Назва товару',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 199.99,
    description: 'Ціна товару',
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    type: 'number',
    example: 25,
    description: 'Знижка на товар у відсотках (0-100)',
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({
    type: 'boolean',
    example: true,
    description: 'Чи є товар топовим у продажу',
  })
  @IsBoolean()
  @IsOptional()
  topSale?: boolean;

  @ApiPropertyOptional({
    type: 'string',
    example: 'Костюм для косплею',
    description: 'Опис товару',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'integer' },
    example: [5, 7],
    description: 'Список ID схожих товарів',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => parseInt(item.trim(), 10))
        .filter((item) => !isNaN(item));
    }
    if (Array.isArray(value)) {
      return value
        .map((item) => parseInt(item, 10))
        .filter((item) => !isNaN(item));
    }
    return value;
  })
  similarProductIds?: number[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Файли зображень (до 10 файлів)',
  })
  images?: Express.Multer.File[];
}
