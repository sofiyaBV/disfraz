import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'admin', description: 'Имя пользователя' })
  @IsNotEmpty({ message: 'Имя пользователя обязательно' })
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'Пароль пользователя',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для авторизации',
  })
  access_token: string;
}
