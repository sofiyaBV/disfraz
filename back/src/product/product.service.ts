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
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { productPaginateConfig } from '../config/pagination.config';

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

  async uploadToImgBB(
    file: Express.Multer.File,
  ): Promise<{ url: string; deleteHash: string }> {
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1200 })
      .jpeg({ quality: 80 })
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
    }
  }

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<Product> {
    console.log('Transformed createProductDto:', createProductDto);
    const imageData: { url: string; deleteHash: string }[] = [];

    try {
      // Загружаем изображения
      for (const file of files) {
        const { url, deleteHash } = await this.uploadToImgBB(file);
        imageData.push({ url, deleteHash });
      }

      // Находим похожие продукты по их ID, если они указаны
      let similarProducts: Product[] = [];
      if (createProductDto.similarProductIds?.length > 0) {
        similarProducts = await this.productRepository.find({
          where: createProductDto.similarProductIds.map((id) => ({ id })),
        });

        // Проверяем, что все указанные ID существуют
        const foundIds = similarProducts.map((p) => p.id);
        const missingIds = createProductDto.similarProductIds.filter(
          (id) => !foundIds.includes(id),
        );
        if (missingIds.length > 0) {
          throw new NotFoundException(
            `Продукты с ID ${missingIds.join(', ')} не найдены`,
          );
        }
      }

      // Создаем продукт
      const productData = {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        images: imageData,
        similarProducts, // Если similarProductIds не указано, будет пустой массив
      };

      const product = this.productRepository.create(productData);
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

  async findAllPag(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate<Product>(
      query,
      this.productRepository,
      productPaginateConfig,
    );
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['attributes', 'similarProducts'],
    });
    console.log(`Found ${products.length} products`);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['attributes', 'similarProducts'],
    });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    console.log(`Found product with ID ${id}:`, product);
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
        relations: ['attributes', 'similarProducts'],
      });

      if (!product) {
        throw new NotFoundException(`Продукт с ID ${id} не найден`);
      }

      if (files.length > 0 && product.images && product.images.length > 0) {
        for (const image of product.images) {
          await this.deleteFromImgBB(image.deleteHash);
        }
      }

      const newImageData: { url: string; deleteHash: string }[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const { url, deleteHash } = await this.uploadToImgBB(file);
          newImageData.push({ url, deleteHash });
        }
      }

      // Обновляем похожие продукты, если переданы новые ID
      if (updateProductDto.similarProductIds) {
        const similarProducts = await this.productRepository.find({
          where: updateProductDto.similarProductIds.map((id) => ({ id })),
        });

        const foundIds = similarProducts.map((p) => p.id);
        const missingIds = updateProductDto.similarProductIds.filter(
          (id) => !foundIds.includes(id),
        );
        if (missingIds.length > 0) {
          throw new NotFoundException(
            `Продукты с ID ${missingIds.join(', ')} не найдены`,
          );
        }

        product.similarProducts = similarProducts;
      }

      manager.merge(Product, product, {
        ...updateProductDto,
        images: newImageData.length > 0 ? newImageData : product.images,
      });

      const updatedProduct = await manager.save(product);
      console.log(`Updated product with ID ${id}:`, updatedProduct);
      return updatedProduct;
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await this.deleteFromImgBB(image.deleteHash);
      }
    }

    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    console.log(`Deleted product with ID ${id}`);
  }
}
