import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';
import { User } from '../../user/entities/user.entity'; // Імпортуємо сутність User
import { Order } from '../../order/entities/order.entity'; // Импортируем Order
@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number; // Уникальный идентификатор элемента корзины

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.carts,
  )
  @JoinColumn({ name: 'productAttributeId' })
  productAttribute: ProductAttribute; // Связь с product_attribute

  @ManyToOne(() => User, (user) => user.carts) // Додаємо зв’язок із User
  @JoinColumn({ name: 'userId' }) // Назва колонки для зовнішнього ключа
  user: User; // Зв’язок з користувачем, який додав товар до кошика

  @Column({ type: 'int', default: 1 })
  quantity: number; // Количество данного продукта в корзине

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number; // Цена за единицу (может быть вычислена на основе productAttribute.product.price)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date; // Дата добавления в корзину

  @OneToMany(() => Order, (order) => order.cart)
  orders: Order[];
}
