import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../auth/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'JohnDoe', description: 'Имя пользователя' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  password: string;

  @ApiProperty({
    example: [Role.User],
    description: 'Роли пользователя',
    isArray: true,
  })
  roles?: Role[]; // Опциональное поле
}
