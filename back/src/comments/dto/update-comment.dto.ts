import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Чудовий костюм, дуже сподобався!',
    description: 'Текст коментаря',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Чи пройшов коментар модерацію',
  })
  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;
}
