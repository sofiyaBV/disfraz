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
    private readonly entityManager: EntityManager, // Добавляем EntityManager для транзакций
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
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
      // Находим продукт
      const product = await manager.findOne(Product, {
        where: { id },
        relations: ['attributes'],
      });

      if (!product) {
        throw new NotFoundException(`Продукт с ID ${id} не найден`);
      }

      // Обновляем базовые поля
      manager.merge(Product, product, updateProductDto);

      // Обновляем связи с атрибутами, если переданы attributeIds
      if (updateProductDto.attributeIds) {
        const attributes = await manager.findByIds(
          Attribute,
          updateProductDto.attributeIds,
        );
        if (attributes.length !== updateProductDto.attributeIds.length) {
          throw new NotFoundException('Некоторые атрибуты не найдены');
        }
        product.attributes = attributes;
      }

      // Сохраняем изменения
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
