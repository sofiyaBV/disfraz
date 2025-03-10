import { PartialType } from '@nestjs/swagger';
import { CreateAttributeDto } from './create-attribute.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Список ID продуктов, связанных с атрибутом',
    required: false,
  })
  @IsOptional()
  @IsArray()
  productIds?: number[]; // Массив ID продуктов для обновления связей
}
