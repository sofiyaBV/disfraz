import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Новий email користувача ',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Новий пароль користувача',
    required: false,
  })
  @IsOptional()
  @MinLength(6, { message: 'Пароль повинен бути не менше 6 символів' })
  password?: string;

  @ApiProperty({
    example: '+380971234567',
    description: 'Новий номер телефону користувача ',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UA', {
    message: 'Некоректний формат номера телефону',
  })
  phone?: string;
}
