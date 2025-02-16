import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Подключаем модель
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // Для других модулей
})
export class ProductModule {}
