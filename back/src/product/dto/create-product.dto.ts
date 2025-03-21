import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Костюм супергероя', description: 'Назва товару' })
  @IsString({ message: 'Назва товару повинна бути рядком' })
  name: string;

  @ApiProperty({ example: 199.99, description: 'Ціна товару' })
  @IsNumber({}, { message: 'Ціна товару повинна бути числом' })
  price: number;

  @ApiProperty({ example: 'Костюм для косплею', description: 'Опис товару' })
  @IsString({ message: 'Опис товару повинен бути рядком' })
  description: string;

  @ApiProperty({
    example: [5, 7],
    description: 'Список ID схожих товарів',
  })
  @IsArray({ message: 'Список схожих товарів повинен бути масивом' })
  @IsInt({
    each: true,
    message: 'Кожен ID схожого товару повинен бути цілим числом',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number);
    }
    return value;
  })
  similarProducts: number[];
}
