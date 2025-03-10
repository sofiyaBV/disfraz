import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';
import { User } from '../../user/entities/user.entity'; // Импортируем User

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор коментаря

  @Column({ type: 'text' })
  content: string; // Текст коментаря

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Дата створення коментаря

  @Column({ type: 'boolean', default: false })
  isModerated: boolean; // Чи пройшов коментар модерацію

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.comments,
  )
  @JoinColumn({ name: 'productAttributeId' })
  productAttribute: ProductAttribute; // Связь с продуктом/атрибутом

  @ManyToOne(() => User, (user) => user.comments) // Добавляем связь с User
  @JoinColumn({ name: 'userId' }) // Внешний ключ userId
  user: User; // Связь с пользователем, оставившим комментарий
}
