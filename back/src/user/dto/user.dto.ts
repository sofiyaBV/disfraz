import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class UserDto {
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор користувача',
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Електронна пошта користувача',
  })
  email: string;

  @ApiPropertyOptional({
    example: '+380991234567',
    description: 'Номер телефону користувача (Україна)',
  })
  phone?: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата створення користувача',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T12:00:00Z',
    description: 'Дата оновлення користувача',
  })
  updatedAt: Date;

  @ApiProperty({ example: ['user', 'admin'], description: 'Ролі користувача' })
  roles: Role[];

  @ApiProperty({
    description: 'Список кошиків користувача',
  })
  carts?: any[];

  @ApiProperty({
    description: 'Список коментарів користувача',
  })
  comments?: any[];

  @ApiProperty({
    description: 'Список замовлень користувача',
  })
  orders?: any[];
}
