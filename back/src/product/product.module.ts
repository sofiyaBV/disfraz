import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Attribute } from '../attribute/entities/attribute.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Attribute]),
    MulterModule.register({
      storage: multer.memoryStorage(), // Храним файлы в памяти перед отправкой в ImgBB
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && allowedTypes.test(ext)) {
          callback(null, true);
        } else {
          callback(
            new Error('Только изображения (jpeg, jpg, png, gif) разрешены!'),
            false,
          );
        }
      },
      limits: {
        fileSize: 32 * 1024 * 1024, // Ограничение размера файла (32 МБ, как у ImgBB)
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
