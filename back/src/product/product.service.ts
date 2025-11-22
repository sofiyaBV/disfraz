import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { ImageService } from './image.service';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { productPaginateConfig } from '../config/pagination.config';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    private readonly entityManager: EntityManager,
    private readonly imageService: ImageService,
  ) {}

  private calculateNewPrice(price: number, discount?: number): number | null {
    if (discount && discount > 0 && discount <= 100) {
      const discountAmount = price * (discount / 100);
      return parseFloat((price - discountAmount).toFixed(2));
    }
    return null;
  }

  private async findSimilarProducts(ids?: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];

    const products = await this.productRepository.find({
      where: { id: In(ids) },
    });

    const foundIds = products.map((p) => p.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Продукти з ID ${missingIds.join(', ')} не знайдені`,
      );
    }

    return products;
  }

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<Product> {
    let imageData: { url: string; deleteHash: string }[] = [];

    try {
      imageData = await this.imageService.uploadMany(files);

      const similarProducts = await this.findSimilarProducts(
        createProductDto.similarProductIds,
      );

      const newPrice = this.calculateNewPrice(
        createProductDto.price,
        createProductDto.discount,
      );

      const product = this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        discount: createProductDto.discount ?? 0,
        topSale: createProductDto.topSale ?? false,
        newPrice,
        description: createProductDto.description,
        images: imageData,
        similarProducts,
      });

      const savedProduct = await this.productRepository.save(product);
      this.logger.log(`Product created: ${savedProduct.id}`);

      return savedProduct;
    } catch (err) {
      if (imageData.length > 0) {
        this.logger.warn('Rolling back uploaded images due to error');
        await this.imageService.deleteMany(imageData);
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
    return this.productRepository.find({
      relations: ['attributes', 'similarProducts'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['attributes', 'similarProducts'],
    });

    if (!product) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

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

      if (files.length > 0) {
        if (product.images?.length > 0) {
          await this.imageService.deleteMany(product.images);
        }
        product.images = await this.imageService.uploadMany(files);
      }

      if (updateProductDto.similarProductIds !== undefined) {
        product.similarProducts = await this.findSimilarProducts(
          updateProductDto.similarProductIds,
        );
      }

      const { similarProductIds, images, ...updateData } = updateProductDto;

      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined),
      );

      Object.assign(product, filteredData);

      const priceForCalculation = updateProductDto.price ?? product.price;
      const discountForCalculation =
        updateProductDto.discount ?? product.discount;
      product.newPrice = this.calculateNewPrice(
        priceForCalculation,
        discountForCalculation,
      );

      const updatedProduct = await manager.save(Product, product);
      this.logger.log(`Product updated: ${id}`);

      return updatedProduct;
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

    if (product.images?.length > 0) {
      await this.imageService.deleteMany(product.images);
    }

    await this.productRepository.delete(id);
    this.logger.log(`Product deleted: ${id}`);
  }
}
