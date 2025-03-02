import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, ProductAttribute])], // Додаємо Cart і ProductAttribute
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}