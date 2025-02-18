import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';

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

  @Column({ type: 'simple-array', nullable: true })
  sizes: string[];

  @Column({ type: 'simple-array', nullable: true })
  materials: string[];

  @Column({ type: 'varchar', length: 255 })
  theme: string;

  @Column({ type: 'simple-array', nullable: true })
  bodyParts: string[];

  @Column({ type: 'boolean', default: false })
  isSet: boolean;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @Column({ type: 'boolean', default: true })
  inStock: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountedPrice: number;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
