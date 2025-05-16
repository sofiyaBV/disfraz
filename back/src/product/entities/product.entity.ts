import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Attribute } from '../../attribute/entities/attribute.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор продукту' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    example: 'Костюм супергероя',
    description: 'Назва товару',
  })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    example: 199.99,
    description: 'Ціна товару',
  })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @ApiProperty({
    example: 25,
    description: 'Знижка на товар у відсотках',
  })
  discount: number;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    example: true,
    description: 'Чи є товар топовим у продажу',
  })
  topSale: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiPropertyOptional({
    example: 149.99,
    description: 'Нова ціна товару після знижки (якщо є)',
  })
  newPrice: number | null;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Костюм для косплею',
    description: 'Опис товару',
  })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    example: [
      { url: 'url1.jpg', deleteHash: 'hash1' },
      { url: 'url2.jpg', deleteHash: 'hash2' },
    ],
    description: 'Список зображень с URL и deleteHash',
  })
  images: { url: string; deleteHash: string }[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'product_similars',
    joinColumn: { name: 'leftProductId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rightProductId', referencedColumnName: 'id' },
  })
  similarProducts: Product[];

  @ManyToMany(() => Attribute, (attribute) => attribute.products)
  @JoinTable({
    name: 'product_attribute',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'attributeId', referencedColumnName: 'id' },
  })
  attributes: Attribute[];
}
