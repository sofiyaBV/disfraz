import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAllPag(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      relations: ['attributes'],
    });

    return { data, total };
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['attributes'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.entityManager.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id },
        relations: ['attributes'],
      });

      if (!product) {
        throw new NotFoundException(`Продукт с ID ${id} не найден`);
      }

      // Обновляем основные поля продукта
      manager.merge(Product, product, updateProductDto);

      // Обновляем связанные атрибуты, если переданы attributeIds
      if (updateProductDto.attributeIds) {
        const existingAttributes = await manager.findByIds(
          Attribute,
          updateProductDto.attributeIds,
        );
        if (existingAttributes.length > 0) {
          product.attributes = existingAttributes;
        } else {
          console.warn('Ни один атрибут не найден для productId:', id);
        }
      }

      // Сохраняем обновленный продукт
      await manager.save(product);
      return product;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
  }
}
