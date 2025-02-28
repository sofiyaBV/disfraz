import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор атрибута

  @Column({ type: 'varchar', length: 255 })
  name: string; // Назва атрибута (наприклад, «шкіра», «M», «фентезі», «руки»)

  @Column({ type: 'varchar', length: 255, nullable: true })
  material: string; // Значення для матеріалу (наприклад, «Шкіра»)

  @Column({ type: 'varchar', length: 255, nullable: true })
  size: string; // Значення для розміру (наприклад, «M»)

  @Column({ type: 'varchar', length: 255, nullable: true })
  theme: string; // Значення для тематики (наприклад, «Фентезі»)

  @Column({ type: 'varchar', length: 255, nullable: true })
  bodyPart: string; // Значення для частини тіла (наприклад, «Руки»)

  @Column({ type: 'boolean', default: false })
  isSet: boolean; // Чи є атрибут вказівкою на комплект (наприклад, true/false)

  @Column({ type: 'varchar', length: 255, nullable: true })
  additionalInfo: string; // Значення для додаткової інформації (наприклад, «Вага 1.5 кг»)

  @Column({ type: 'varchar', length: 255, nullable: true })
  inStock: string; // Значення для наявності (наприклад, «Доступний на складі»)

  @Column({ type: 'text', nullable: true })
  valueText?: string; // Для текстових значень (загальне поле для всіх текстів, якщо потрібно)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valueNumber?: number; // Для числових значень, якщо потрібно (наприклад, ціна чи розмір у числовому форматі)

  // Зв’язок багато до багатьох із Product через ProductAttribute
  @ManyToMany(() => Product, (product) => product.attributes)
  products: Product[];
}