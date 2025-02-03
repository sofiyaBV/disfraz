import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'JohnDoe', description: 'Имя пользователя' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  password: string;
}
