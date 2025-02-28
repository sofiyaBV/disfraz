import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';

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
  images: string[];

  // Додаємо схожі товари як JSON
  @Column({ type: 'simple-array', nullable: true })
  similarProducts: number[]; // Масив ID схожих товарів

  // Зв’язок через OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  // Зв’язок багато до багатьох із Attribute через ProductAttribute
  @ManyToMany(() => Attribute, (attribute) => attribute.products)
  @JoinTable({
    name: 'product_attribute', // Назва таблиці зв’язку
    joinColumn: { name: 'productId', referencedColumnName: 'id' }, // Колонка для Product
    inverseJoinColumn: { name: 'attributeId', referencedColumnName: 'id' }, // Колонка для Attribute
  })
  attributes: Attribute[];
}