import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAttributeDto {
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
  description?: string;
}
