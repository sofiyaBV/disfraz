import { DataSource } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Payment } from '../payment/entities/payment.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    Product,
    Attribute,
    ProductAttribute,
    Cart,
    Order,
    User,
    Comment,
    Payment,
  ],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
  logging: true,
});
