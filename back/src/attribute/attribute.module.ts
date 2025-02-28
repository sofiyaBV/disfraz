import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Product } from '../product/entities/product.entity';
import { AttributesService } from '../attribute/attribute.service';
import { AttributesController } from '../attribute/attribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, Product])],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService],
})
export class AttributesModule {}