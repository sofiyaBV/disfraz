import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Список URL изображений товара

  @Column({ type: 'simple-array', nullable: true })
  sizes: string[]; // Доступные размеры

  @Column({ type: 'simple-array', nullable: true })
  materials: string[]; // Список материалов

  @Column({ type: 'varchar', length: 255 })
  theme: string; // Тематика костюма

  @Column({ type: 'simple-array', nullable: true })
  bodyParts: string[]; // Части тела, на которые надевается

  @Column({ type: 'boolean', default: false })
  isSet: boolean; // Это комплект или отдельный элемент

  @Column({ type: 'text', nullable: true })
  additionalInfo: string; // Дополнительная информация

  @Column({ type: 'boolean', default: true })
  inStock: boolean; // Есть ли в наличии

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number; // Скидка в процентах

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountedPrice: number; // Цена со скидкой

  @ManyToMany(() => Product)
  @JoinTable()
  relatedProducts: Product[]; // Список похожих товаров
}
