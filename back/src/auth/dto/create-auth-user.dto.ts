import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email пользователя для авторизации (должен быть @gmail.com)',
  })
  email: string;

  @ApiProperty({
    example: '+12025550123',
    description: 'Номер телефона пользователя в международном формате',
  })
  phone: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Пароль пользователя (минимум 6 символов, должен содержать буквы, цифры и специальные символы)',
  })
  password: string;
}
