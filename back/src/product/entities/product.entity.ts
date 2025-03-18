import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'; // Лише декоратори TypeORM
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Імпорт для Swagger
import { Attribute } from '../../attribute/entities/attribute.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор продукту' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'Костюм супергероя', description: 'Назва товару' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ example: 199.99, description: 'Ціна товару' })
  price: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({
    example: 'Костюм для косплею',
    description: 'Опис товару',
  })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    example: ['url1.jpg', 'url2.jpg'],
    description: 'Список зображень',
  })
  images: string[];

  @Column({
    type: 'integer',
    array: true,
    nullable: true,
    name: 'similarproducts',
  })
  @ApiProperty({ example: [5, 7], description: 'Список ID схожих товарів' })
  similarProducts: number[];

  @ManyToMany(() => Attribute, (attribute) => attribute.products)
  @JoinTable({
    name: 'product_attribute',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'attributeId', referencedColumnName: 'id' },
  })
  attributes: Attribute[];
}
