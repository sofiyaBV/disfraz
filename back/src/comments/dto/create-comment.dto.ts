import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Чудовий костюм, дуже сподобався!',
    description: 'Текст коментаря',
  })
  @IsString()
  content: string;
}
