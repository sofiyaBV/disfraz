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

// Інтерфейс для відповіді від ImgBB API
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
      throw new Error('IMGBB_API_KEY не визначено у змінних оточення');
    }
  }

  // Допоміжний метод для розрахунку нової ціни
  private calculateNewPrice(
    price: number,
    discount: number | undefined,
  ): number | null {
    if (discount && discount > 0 && discount <= 100) {
      const discountAmount = price * (discount / 100); // Знаходимо суму знижки
      return parseFloat((price - discountAmount).toFixed(2)); // Нова ціна з округленням до 2 знаків
    }
    return null; // Якщо знижки немає, newPrice буде null
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
        throw new Error('Не вдалося завантажити зображення в ImgBB');
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response
        ? `Помилка ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message || 'Невідома помилка під час завантаження в ImgBB';
      throw new Error(`Помилка завантаження в ImgBB: ${errorMessage}`);
    }
  }

  async deleteFromImgBB(deleteHash: string): Promise<void> {
    try {
      await axios.get(`https://api.imgbb.com/1/delete/${deleteHash}`);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response
        ? `Ошибка ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : error.message || 'Невідома помилка під час видалення з ImgBB';
      console.warn(
        `Не вдалося видалити зображення зdeleteHash ${deleteHash}: ${errorMessage}`,
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
      // Завантажуємо зображення
      for (const file of files) {
        const { url, deleteHash } = await this.uploadToImgBB(file);
        imageData.push({ url, deleteHash });
      }

      // Знаходимо схожі продукти за їхніми ID, якщо вони вказані
      let similarProducts: Product[] = [];
      if (createProductDto.similarProductIds?.length > 0) {
        similarProducts = await this.productRepository.find({
          where: createProductDto.similarProductIds.map((id) => ({ id })),
        });

        // Перевіряємо, що всі зазначені ID існують
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

      // Розраховуємо нову ціну
      const newPrice = this.calculateNewPrice(
        createProductDto.price,
        createProductDto.discount,
      );

      // Створюємо продукт
      const productData = {
        name: createProductDto.name,
        price: createProductDto.price,
        discount: createProductDto.discount ?? 0, // За замовчуванням 0
        topSale: createProductDto.topSale ?? false, // За замовчуванням false
        newPrice, // Нова ціна
        description: createProductDto.description,
        images: imageData,
        similarProducts,
      };

      const product = this.productRepository.create(productData);
      const savedProduct = await this.productRepository.save(product);
      console.log('Created product:', savedProduct);
      return savedProduct;
    } catch (err) {
      console.error('Помилка під час створення продукту:', err);
      if (imageData.length > 0) {
        console.warn(
          'Зображення не будуть видалені з ImgBB, оскільки API не підтримує видалення. Ви можете видалити їх вручну:',
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
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
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
        throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
      }

      // Обработка новых изображений
      let updatedImages = product.images || [];

      if (files.length > 0) {
        // Если загружаются новые файлы, удаляем старые изображения из ImgBB
        if (product.images && product.images.length > 0) {
          for (const image of product.images) {
            await this.deleteFromImgBB(image.deleteHash);
          }
        }

        // Загружаем новые изображения
        const newImageData: { url: string; deleteHash: string }[] = [];
        for (const file of files) {
          const { url, deleteHash } = await this.uploadToImgBB(file);
          newImageData.push({ url, deleteHash });
        }
        updatedImages = newImageData;
      }

      // Обновляем схожие продукты, если передано новые ID
      if (updateProductDto.similarProductIds !== undefined) {
        if (updateProductDto.similarProductIds.length > 0) {
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
        } else {
          // Если передан пустой массив, очищаем связи
          product.similarProducts = [];
        }
      }

      // Определяем цену для расчета новой цены (берем обновленную или старую)
      const priceForCalculation = updateProductDto.price ?? product.price;
      // Определяем скидку для расчета (берем обновленную или старую)
      const discountForCalculation =
        updateProductDto.discount ?? product.discount;
      // Рассчитываем новую цену
      const newPrice = this.calculateNewPrice(
        priceForCalculation,
        discountForCalculation,
      );

      // Обновляем только переданные поля
      if (updateProductDto.name !== undefined) {
        product.name = updateProductDto.name;
      }
      if (updateProductDto.price !== undefined) {
        product.price = updateProductDto.price;
      }
      if (updateProductDto.description !== undefined) {
        product.description = updateProductDto.description;
      }
      if (updateProductDto.discount !== undefined) {
        product.discount = updateProductDto.discount;
      }
      if (updateProductDto.topSale !== undefined) {
        product.topSale = updateProductDto.topSale;
      }

      // Обновляем изображения и новую цену
      product.images = updatedImages;
      product.newPrice = newPrice;

      // Сохраняем обновленный продукт
      const updatedProduct = await manager.save(Product, product);
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
