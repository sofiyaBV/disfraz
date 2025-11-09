import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат email' })
  email?: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефону користувача',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'Новий пароль користувача',
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password?: string;
}
