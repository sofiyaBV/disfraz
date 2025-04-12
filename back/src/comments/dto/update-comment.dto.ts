import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Новый текст комментария',
    example: 'Обновленный отзыв!',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
