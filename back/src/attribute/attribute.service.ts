import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm'; // Імпортуємо Not і IsNull
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(Product) // Додаємо репозиторій для Product
    private productRepository: Repository<Product>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Attribute> {
    return this.attributeRepository.findOneOrFail({ where: { id }, relations: ['products'] });
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    await this.attributeRepository.update(id, updateAttributeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.attributeRepository.delete(id);
  }

  // Пошук атрибутів за типом (за текстовими полями)
  async findByType(type: 'material' | 'size' | 'theme' | 'bodyPart' | 'isSet' | 'additionalInfo' | 'inStock'): Promise<Attribute[]> {
    const field = type === 'isSet' ? 'isSet' : type; // Для isSet використовуємо булеве поле
    if (type === 'isSet') {
      return this.attributeRepository.find({ where: { [field]: true } });
    }
    // Повертаємо лише записи, де поле не є NULL (рекомендований підхід)
    return this.attributeRepository.find({ where: { [field]: Not(IsNull()) } }); 
    // Або, якщо хочете повернути всі записи (включаючи NULL):
    // return this.attributeRepository.find({ where: { [field]: undefined } });
  }

  // Пошук атрибутів за назвою
  async findByName(name: string): Promise<Attribute> {
    return this.attributeRepository.findOne({ where: { name } });
  }

  // Отримати продукти, які мають цей атрибут
  async getProducts(attributeId: number): Promise<Product[]> {
    const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId }, relations: ['products'] });
    return attribute.products;
  }

  // Додати продукт до атрибута
  async addProduct(attributeId: number, productId: number): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId }, relations: ['products'] });
    const product = await this.productRepository.findOneOrFail({ where: { id: productId } });
    attribute.products = attribute.products || [];
    if (!attribute.products.some(prod => prod.id === productId)) {
      attribute.products.push(product);
    }
    return this.attributeRepository.save(attribute);
  }

  // Видалити продукт з атрибута
  async removeProduct(attributeId: number, productId: number): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId }, relations: ['products'] });
    attribute.products = attribute.products.filter(prod => prod.id !== productId);
    return this.attributeRepository.save(attribute);
  }
}