import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'Костюм супергероя',
    description: 'Назва товару',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    example: 199.99,
    description: 'Ціна товару',
  })
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 25,
    description: 'Знижка на товар у відсотках (0-100)',
  })
  discount?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'Чи є товар топовим у продажу',
  })
  topSale?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Костюм для косплею',
    description: 'Опис товару',
  })
  description?: string;

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
  @ApiPropertyOptional({
    example: [5, 7],
    description: 'Список ID схожих товарів',
  })
  similarProductIds?: number[];
}
