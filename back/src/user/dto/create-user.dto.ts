import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача для авторизації',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Номер телефону користувача',
  })
  @IsOptional()
  phone: string;

  @IsOptional()
  roles?: Role[];

  @ApiProperty({
    example: 'password123',
    description: 'Пароль користувача (мінімум 6 символів)',
  })
  @MinLength(6)
  password: string;
}
