import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'admin', description: 'Имя пользователя' })
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'Пароль пользователя',
    minLength: 6,
  })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для авторизации',
  })
  access_token: string;
}
