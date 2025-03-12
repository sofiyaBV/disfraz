import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity'; // Импортируем сущность Cart
import { User } from '../../user/entities/user.entity';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'text' })
  deliveryAddress: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  // Добавляем связь ManyToOne с Cart
  @ManyToOne(() => Cart, (cart) => cart.id, { nullable: true })
  @JoinColumn({ name: 'cartId' }) // Указываем имя колонки для внешнего ключа
  cart: Cart;

  // Новая связь ManyToOne с User
  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' }) // Указываем имя колонки для внешнего ключа
  user: User;

  @Column({ type: 'int', nullable: true }) // Поле для хранения cartId
  cartId: number;
}
