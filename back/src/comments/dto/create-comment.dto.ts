import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Отличный костюм, рекомендую!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID атрибута продукта (связь с product_attribute)',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productAttributeId: number;
}
