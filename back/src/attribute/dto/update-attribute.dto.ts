import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateAttributeDto {
  @ApiProperty({ 
    example: 'Тканина', 
    description: 'Нова назва атрибута', 
    required: false 
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут матеріалом (наприклад, «Тканина»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isMaterial?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут розміром (наприклад, «L»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isSize?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут тематикою (наприклад, «Наука»)', 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isTheme?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Чи є атрибут частиною тіла (наприклад, «Ноги»)', 
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
    description: 'Нове булеве значення (наприклад, для isSet чи inStock)', 
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  valueBoolean?: boolean;

  @ApiProperty({ 
    example: 'Оновлена додаткова інформація', 
    description: 'Нове текстове значення (наприклад, для матеріалу, розміру, тематики, додаткової інформації)', 
    required: false 
  })
  @IsString()
  @IsOptional()
  valueText?: string;

  @ApiProperty({ 
    example: 15.5, 
    description: 'Нове числове значення (наприклад, для ціни чи розміру)', 
    required: false 
  })
  @IsNumber()
  @IsOptional()
  valueNumber?: number;
}