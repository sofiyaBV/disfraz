import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({
    example: 'Шкіра',
    description: 'Значення для матеріалу (наприклад, «Шкіра»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({
    example: 'M',
    description: 'Значення для розміру (наприклад, «M»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    example: 'Фентезі',
    description: 'Значення для тематики (наприклад, «Фентезі»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({
    example: 'Руки',
    description: 'Значення для частини тіла (наприклад, «Руки»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  bodyPart?: string;

  @ApiProperty({
    example: true,
    description:
      'Чи є атрибут вказівкою на комплект (наприклад, костюм із кількох частин)',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSet?: boolean;

  @ApiProperty({
    example: 'Вага 1.5 кг',
    description:
      'Значення для додаткової інформації (наприклад, «Вага 1.5 кг»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Доступний на складі',
    description: 'Значення для наявності (наприклад, «Доступний на складі»)',
    required: false,
  })
  @IsString()
  @IsOptional()
  inStock?: string;
}
