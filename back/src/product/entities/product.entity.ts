import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Attribute } from '../../attribute/entities/attribute.entity';

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

  @Column({ type: 'text', array: true, nullable: true }) // Змінено на 'text' з array: true для images
  images: string[];

  @Column({
    type: 'integer', // Вказуємо 'integer' для базового типу
    array: true, // Вказуємо, що це масив
    nullable: true,
    name: 'similarproducts', // Змінено на реальну назву колонки в базі даних
  })
  similarProducts: number[]; // Масив ID схожих товарів

  // Зв’язок багато до багатьох із Attribute через ProductAttribute
  @ManyToMany(() => Attribute, (attribute) => attribute.products)
  @JoinTable({
    name: 'product_attribute', // Назва таблиці зв’язку
    joinColumn: { name: 'productId', referencedColumnName: 'id' }, // Колонка для Product
    inverseJoinColumn: { name: 'attributeId', referencedColumnName: 'id' }, // Колонка для Attribute
  })
  attributes: Attribute[];
}