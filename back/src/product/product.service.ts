import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Attribute) // Додаємо репозиторій для Attribute
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['attributes'] });
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id }, relations: ['attributes'] });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  // Додати атрибут до продукту
  async addAttribute(productId: number, attributeId: number): Promise<Product> {
    const product = await this.productRepository.findOneOrFail({ where: { id: productId }, relations: ['attributes'] });
    const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId } });
    product.attributes = product.attributes || [];
    if (!product.attributes.some(attr => attr.id === attributeId)) {
      product.attributes.push(attribute);
    }
    return this.productRepository.save(product);
  }

  // Видалити атрибут з продукту
  async removeAttribute(productId: number, attributeId: number): Promise<Product> {
    const product = await this.productRepository.findOneOrFail({ where: { id: productId }, relations: ['attributes'] });
    product.attributes = product.attributes.filter(attr => attr.id !== attributeId);
    return this.productRepository.save(product);
  }

  // Отримати атрибути для продукту
  async getAttributes(productId: number): Promise<Attribute[]> {
    const product = await this.productRepository.findOneOrFail({ where: { id: productId }, relations: ['attributes'] });
    return product.attributes;
  }
}