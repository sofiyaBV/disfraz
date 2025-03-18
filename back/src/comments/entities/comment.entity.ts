import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Імпорт для Swagger
import { ProductAttribute } from '../../product-attribute/entities/product-attribute.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Унікальний ідентифікатор коментаря',
  })
  id: number;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'Дуже хороший продукт!',
    description: 'Текст коментаря',
  })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'Дата створення коментаря',
  })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ example: false, description: 'Чи пройшов коментар модерацію' })
  isModerated: boolean;

  @ManyToOne(
    () => ProductAttribute,
    (productAttribute) => productAttribute.comments,
  )
  @JoinColumn({ name: 'productAttributeId' })
  productAttribute: ProductAttribute;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;
}
