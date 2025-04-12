import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, ProductAttribute, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
