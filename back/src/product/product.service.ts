import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import axios, { AxiosError } from 'axios';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

// Интерфейс для ответа от ImgBB API
interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
    delete_url: string;
  };
  status: number;
}

@Injectable()
export class ProductService {
  private readonly imgbbApiKey: string;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.imgbbApiKey = this.configService.get<string>('IMGBB_API_KEY');
    if (!this.imgbbApiKey) {
      throw new Error('IMGBB_API_KEY is not defined in environment variables');
    }
  }

  // Метод для сжатия и загрузки изображения в ImgBB
  async uploadToImgBB(
    file: Express.Multer.File,
  ): Promise<{ url: string; deleteHash: string }> {
    // Сжимаем изображение
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1200 }) // Уменьшаем ширину до 1200 пикселей
      .jpeg({ quality: 80 }) // Сжимаем JPEG с качеством 80%
      .toBuffer();

    const formData = new FormData();
    formData.append('image', compressedBuffer.toString('base64'));

    try {
      const response = await axios.post<ImgBBResponse>(
        'https://api.imgbb.com/1/upload',
        formData,
        {
          params: { key: this.imgbbApiKey },
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (response.data.success) {
        return {
          url: response.data.data.url,
          deleteHash: response.data.data.delete_url.split('/').pop(),
        };
      } else {
        throw new Error('Не удалось загрузить изображение в ImgBB');
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response
        ? `Ошибка ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message || 'Неизвестная ошибка при загрузке в ImgBB';
      throw new Error(`Ошибка загрузки в ImgBB: ${errorMessage}`);
    }
  }

  // Метод для удаления изображения из ImgBB
  async deleteFromImgBB(deleteHash: string): Promise<void> {
    try {
      await axios.get(`https://api.imgbb.com/1/delete/${deleteHash}`);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response
        ? `Ошибка ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message || 'Неизвестная ошибка при удалении из ImgBB';
      console.warn(
        `Не удалось удалить изображение с deleteHash ${deleteHash}: ${errorMessage}`,
      );
      // Не бросаем ошибку, чтобы не прерывать выполнение
    }
  }

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<Product> {
    console.log('Transformed createProductDto:', createProductDto);
    const imageData: { url: string; deleteHash: string }[] = [];

    try {
      // Загружаем изображения в ImgBB
      for (const file of files) {
        const { url, deleteHash } = await this.uploadToImgBB(file);
        imageData.push({ url, deleteHash });
      }

      // Убедимся, что similarProducts - это массив
      const productData = {
        ...createProductDto,
        similarProducts: Array.isArray(createProductDto.similarProducts)
          ? createProductDto.similarProducts
          : [], // Если не массив, передаем пустой массив
        images: imageData,
      };

      // Создаем продукт
      const product = this.productRepository.create(productData);

      // Сохраняем продукт в базе данных
      const savedProduct = await this.productRepository.save(product);
      console.log('Created product:', savedProduct);
      return savedProduct;
    } catch (err) {
      console.error('Ошибка при создании продукта:', err);
      if (imageData.length > 0) {
        console.warn(
          'Изображения не будут удалены из ImgBB, так как API не поддерживает удаление. Вы можете удалить их вручную:',
          imageData,
        );
      }
      throw err;
    }
  }

  async findAllPag(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      relations: ['attributes'],
    });

    console.log(`Found ${total} products, page ${page}, limit ${limit}`); // Для отладки
    return { data, total };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['attributes'],
    });
    console.log(`Found ${products.length} products`); // Для отладки
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    console.log(`Found product with ID ${id}:`, product); // Для отладки
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<Product> {
    return this.entityManager.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id },
        relations: ['attributes'],
      });

      if (!product) {
        throw new NotFoundException(`Продукт с ID ${id} не найден`);
      }

      // Удаляем старые изображения из ImgBB, если загружены новые
      if (files.length > 0 && product.images && product.images.length > 0) {
        for (const image of product.images) {
          await this.deleteFromImgBB(image.deleteHash);
        }
      }

      // Загружаем новые изображения в ImgBB
      const newImageData: { url: string; deleteHash: string }[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const { url, deleteHash } = await this.uploadToImgBB(file);
          newImageData.push({ url, deleteHash });
        }
      }

      // Обновляем продукт
      manager.merge(Product, product, {
        ...updateProductDto,
        images: newImageData.length > 0 ? newImageData : product.images,
      });
      const updatedProduct = await manager.save(product);
      console.log(`Updated product with ID ${id}:`, updatedProduct); // Для отладки
      return updatedProduct;
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }

    // Удаляем связанные изображения из ImgBB
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await this.deleteFromImgBB(image.deleteHash);
      }
    }

    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    console.log(`Deleted product with ID ${id}`); // Для отладки
  }
}
