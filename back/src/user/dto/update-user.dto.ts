import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Новый email пользователя (опционально)',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Новый пароль пользователя (опционально, минимум 6 символов)',
    required: false,
  })
  @IsOptional()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password?: string;

  @ApiProperty({
    example: '+380971234567',
    description: 'Новый номер телефона пользователя (опционально)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UA', {
    message:
      'Некорректный формат номера телефона (должен быть украинский номер)',
  })
  phone?: string;
}
