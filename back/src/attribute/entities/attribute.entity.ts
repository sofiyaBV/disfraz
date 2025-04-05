import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Імпорт для Swagger
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор атрибута' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ example: 'Шкіра', description: 'Матеріал атрибута' })
  material: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ example: 'M', description: 'Розмір атрибута' })
  size: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({ example: 'Фентезі', description: 'Тематика атрибута' })
  theme: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: 'Руки',
    description: 'Частина тіла атрибута',
  })
  bodyPart: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    example: false,
    description: 'Чи є атрибут вказівкою на комплект',
  })
  isSet: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: 'Вага 1.5 кг',
    description: 'Додаткова інформація про атрибут',
  })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiPropertyOptional({
    example: 'Доступний на складі',
    description: 'Наявність атрибута',
  })
  inStock: string;

  @ManyToMany(() => Product, (product) => product.attributes)
  @JoinTable({
    name: 'product_attribute',
    joinColumn: { name: 'attributeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' },
  })
  products: Product[];
}
