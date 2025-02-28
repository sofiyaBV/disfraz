import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_attribute')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор зв’язку

  @Column({ type: 'int' })
  productId: number; // ID продукту

  @Column({ type: 'int' })
  attributeId: number; // ID атрибута
}