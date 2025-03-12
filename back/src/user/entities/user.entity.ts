import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Cart } from '../../cart/entities/cart.entity'; // Імпортуємо сутність Cart
import { Comment } from '../../comments/entities/comment.entity';
import { Order } from '../../order/entities/order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string; // Email для авторизації (замість username, оскільки ТЗ вказує email/google/phone)

  @Column({ type: 'varchar', length: 255 })
  @MinLength(6)
  password: string; // Пароль для login+password

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsPhoneNumber('UA') // Номер телефону для авторизації (Україна за замовчуванням)
  phone: string; // Номер телефону (додано за вашим запитом)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar', // Змінено з enum на varchar для кращої сумісності
    array: true,
    default: ['user'], // Значення за замовчуванням як масив рядків
  })
  roles: Role[];

  @OneToMany(() => Cart, (cart) => cart.user) // Додаємо зв’язок із Cart
  carts: Cart[]; // Список кошиків користувача
  @OneToMany(() => Comment, (comment) => comment.user) // Обратное отношение к комментариям
  comments: Comment[];
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
