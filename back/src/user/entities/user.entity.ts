import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Імпорт для Swagger
import { Role } from '../../auth/enums/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор користувача',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty({ message: 'Електронна пошта не може бути порожньою' })
  @IsEmail({}, { message: 'Некоректний формат електронної пошти' })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Електронна пошта користувача',
  })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(6, { message: 'Пароль повинен містити щонайменше 6 символів' })
  @ApiProperty({ example: 'password123', description: 'Пароль користувача' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: '+380991234567',
    description: 'Номер телефону користувача (Україна)',
  })
  phone: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата створення користувача',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2023-01-02T12:00:00Z',
    description: 'Дата оновлення користувача',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    array: true,
    default: ['user'],
  })
  @ApiProperty({ example: ['user', 'admin'], description: 'Ролі користувача' })
  roles: Role[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
