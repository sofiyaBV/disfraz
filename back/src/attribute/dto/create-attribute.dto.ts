import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ 
    example: 'Шкіра', 
    description: 'Назва атрибута' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут матеріалом (наприклад, «Шкіра»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isMaterial?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут розміром (наприклад, «M»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isSize?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут тематикою (наприклад, «Фентезі»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isTheme?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут частиною тіла (наприклад, «Руки»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isBodyPart?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут вказівкою на комплект', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isSet?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут додатковою інформацією', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isAdditionalInfo?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут інформацією про наявність', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isInStock?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Булеве значення (наприклад, для isSet чи inStock)', 
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  valueBoolean?: boolean;

  @ApiProperty({ 
    example: 'Додаткова інформація про атрибут', 
    description: 'Текстове значення (наприклад, для матеріалу, розміру, тематики, додаткової інформації)', 
    required: false 
  })
  @IsString()
  @IsOptional()
  valueText?: string;

  @ApiProperty({ 
    example: 10.5, 
    description: 'Числове значення (наприклад, для ціни чи розміру)', 
    required: false 
  })
  @IsNumber()
  @IsOptional()
  valueNumber?: number;
}