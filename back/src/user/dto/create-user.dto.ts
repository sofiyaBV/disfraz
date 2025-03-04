import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя для авторизации',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефона пользователя (Украина, опционально)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UA')
  phone?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя (минимум 6 символов)',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: [Role.User],
    description: 'Роли пользователя',
    isArray: true,
  })
  roles?: Role[]; // Опциональное поле
}
