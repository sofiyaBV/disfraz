import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Order } from '../../order/entities/order.entity';

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
    description: 'Номер телефону користувача ',
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
    type: () => [Cart],
  })
  carts?: Cart[];

  @ApiProperty({
    description: 'Список коментарів користувача',
    type: () => [Comment],
  })
  comments?: Comment[];

  @ApiProperty({
    description: 'Список замовлень користувача',
    type: () => [Order],
  })
  orders?: Order[];
}
