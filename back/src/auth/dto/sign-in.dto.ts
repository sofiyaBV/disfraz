import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат email' })
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль користувача',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефону користувача',
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
