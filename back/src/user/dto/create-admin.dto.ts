import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Email',
    description: 'Email користувача для авторизації',
  })
  @IsNotEmpty({ message: 'Email не може бути порожнім' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль користувача (мінімум 6 символів)',
  })
  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(6, { message: 'Пароль повинен бути не менше 6 символів' })
  password: string;
}
