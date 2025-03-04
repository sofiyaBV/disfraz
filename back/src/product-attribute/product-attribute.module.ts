import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './entities/product-attribute.entity';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeController } from './product-attribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute, Product, Attribute])],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
})
export class ProductAttributeModule {}
