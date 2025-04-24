import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
export class SignInDto {
  @ApiProperty({ example: 'admin', description: 'Имя пользователя' })
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'Пароль користувача',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен для авторизації',
  })
  access_token: string;
}
