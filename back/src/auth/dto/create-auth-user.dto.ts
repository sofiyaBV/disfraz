import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateAuthUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя для авторизации',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефона пользователя (Украина)',
  })
  @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
  @IsPhoneNumber('UA', { message: 'Некорректный номер телефона для Украины' })
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя (минимум 6 символов)',
  })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;
}
