import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateAttributeDto {
  @ApiProperty({
    example: 'Шкіра',
    description: 'Назва атрибута (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Назва атрибута повинна бути рядком' })
  name?: string;

  @ApiProperty({
    example: 'Шкіра',
    description: 'Значення для матеріалу (наприклад, «Шкіра», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Матеріал повинен бути рядком' })
  material?: string;

  @ApiProperty({
    example: 'M',
    description: 'Значення для розміру (наприклад, «M», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Розмір повинен бути рядком' })
  size?: string;

  @ApiProperty({
    example: 'Фентезі',
    description: 'Значення для тематики (наприклад, «Фентезі», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Тематика повинна бути рядком' })
  theme?: string;

  @ApiProperty({
    example: 'Руки',
    description: 'Значення для частини тіла (наприклад, «Руки», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Частина тіла повинна бути рядком' })
  bodyPart?: string;

  @ApiProperty({
    example: true,
    description:
      'Чи є атрибут вказівкою на комплект (наприклад, костюм із кількох частин, опціонально)',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Поле isSet повинно бути булевим' })
  isSet?: boolean;

  @ApiProperty({
    example: 'Вага 1.5 кг',
    description:
      'Значення для додаткової інформації (наприклад, «Вага 1.5 кг», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Додаткова інформація повинна бути рядком' })
  additionalInfo?: string;

  @ApiProperty({
    example: 'Доступний на складі',
    description:
      'Значення для наявності (наприклад, «Доступний на складі», опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Наявність повинна бути рядком' })
  inStock?: string;

  @ApiProperty({
    example: 'Матеріал шкіри високої якості, стійкий до зносу',
    description:
      'Текстове значення (наприклад, для матеріалу, розміру, тематики, додаткової інформації, опціонально)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Текстове значення повинно бути рядком' })
  valueText?: string;

  @ApiProperty({
    example: 45.0,
    description:
      'Числове значення (наприклад, для ціни чи розміру, наприклад, розмір у см, опціонально)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Числове значення повинно бути числом' })
  valueNumber?: number;

  @ApiProperty({
    example: [1, 2],
    description: 'Список ID продуктів, пов’язаних з атрибутом (опціонально)',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Список ID продуктів повинен бути масивом' })
  @IsInt({ each: true, message: 'Кожен ID продукту повинен бути цілим числом' })
  productIds?: number[];
}
