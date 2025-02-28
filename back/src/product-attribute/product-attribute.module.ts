import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeController } from './product-attribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Attribute, ProductAttribute])],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
})
export class ProductAttributesModule {}