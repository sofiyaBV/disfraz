import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Список ID атрибутов, связанных с продуктом',
    required: false,
  })
  @IsOptional()
  @IsArray()
  attributeIds?: number[]; // Массив ID атрибутов для обновления связей
}
