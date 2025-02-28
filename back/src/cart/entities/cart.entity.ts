import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор кошика

  @Column({ type: 'simple-array', nullable: true }) // Масив ID товарів у кошику
  productIds: number[]; // Список ID товарів, які користувач вибрав (наприклад, [1, 2, 3])

  @Column({ type: 'simple-json', nullable: true }) // JSON для зберігання деталей товарів і кількостей
  items: {
    productId: number; // ID товару
    quantity: number; // Кількість товару в кошику
    price: number; // Ціна товару на момент додавання
  }[]; // Деталі товарів у кошику (ID, кількість, ціна)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }) // Загальна сума кошика
  totalAmount: number; // Загальна сума всіх товарів у кошику (з урахуванням кількостей і цін)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Дата створення кошика
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true }) // Дата оновлення кошика
  updatedAt: Date;
}