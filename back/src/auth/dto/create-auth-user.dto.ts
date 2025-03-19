import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateAuthUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email пользователя для авторизации (должен быть @gmail.com)',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
    message: 'Email должен заканчиваться на @gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '+12025550123',
    description: 'Номер телефона пользователя в международном формате',
  })
  @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Номер телефона должен быть в международном формате: начинаться с "+" и содержать от 6 до 15 цифр (например, +12025550123)',
  })
  phone: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Пароль пользователя (минимум 6 символов, должен содержать буквы, цифры и специальные символы)',
  })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Пароль должен содержать как минимум одну букву, одну цифру и один специальный символ (@$!%*?&)',
  })
  password: string;
}
