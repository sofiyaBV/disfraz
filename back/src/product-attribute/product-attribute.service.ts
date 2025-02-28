import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { ProductAttribute } from './entities/product-attribute.entity';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(Product) // Додаємо репозиторій для Product
    private productRepository: Repository<Product>,
    @InjectRepository(Attribute) // Додаємо репозиторій для Attribute
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(createProductAttributeDto: CreateProductAttributeDto): Promise<ProductAttribute> {
    const { productId, attributeId } = createProductAttributeDto;

    // Знаходимо Product за ID
    const product = await this.productRepository.findOneOrFail({ where: { id: productId } });
    // Знаходимо Attribute за ID
    const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId } });

    // Створюємо новий зв’язок
    const productAttribute = this.productAttributeRepository.create({
      product,
      attribute,
    });

    return this.productAttributeRepository.save(productAttribute);
  }

  async findAll(): Promise<ProductAttribute[]> {
    return this.productAttributeRepository.find({
      relations: ['product', 'attribute'], // Завантажуємо пов’язані сутності
    });
  }

  async findOne(id: number): Promise<ProductAttribute> {
    return this.productAttributeRepository.findOneOrFail({
      where: { id },
      relations: ['product', 'attribute'],
    });
  }

  async update(id: number, updateProductAttributeDto: UpdateProductAttributeDto): Promise<ProductAttribute> {
    const { productId, attributeId } = updateProductAttributeDto;

    const productAttribute = await this.findOne(id);

    if (productId) {
      const product = await this.productRepository.findOneOrFail({ where: { id: productId } });
      productAttribute.product = product;
    }

    if (attributeId) {
      const attribute = await this.attributeRepository.findOneOrFail({ where: { id: attributeId } });
      productAttribute.attribute = attribute;
    }

    return this.productAttributeRepository.save(productAttribute);
  }

  async remove(id: number): Promise<void> {
    await this.productAttributeRepository.delete(id);
  }

  // Додатковий метод для пошуку зв’язків за productId
  async findByProductId(productId: number): Promise<ProductAttribute[]> {
    return this.productAttributeRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'attribute'],
    });
  }

  // Додатковий метод для пошуку зв’язків за attributeId
  async findByAttributeId(attributeId: number): Promise<ProductAttribute[]> {
    return this.productAttributeRepository.find({
      where: { attribute: { id: attributeId } },
      relations: ['product', 'attribute'],
    });
  }
}