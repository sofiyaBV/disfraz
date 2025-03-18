import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { ProductAttribute } from './entities/product-attribute.entity';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(
    createProductAttributeDto: CreateProductAttributeDto,
  ): Promise<ProductAttribute> {
    const { productId, attributeId } = createProductAttributeDto;

    const product = await this.productRepository.findOneOrFail({
      where: { id: productId },
    });
    const attribute = await this.attributeRepository.findOneOrFail({
      where: { id: attributeId },
    });

    const productAttribute = this.productAttributeRepository.create({
      product,
      attribute,
    });

    return this.productAttributeRepository.save(productAttribute);
  }

  async findAllPag(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.productAttributeRepository.findAndCount({
      skip,
      take: limit,
      relations: ['product', 'attribute'], // Завантажуємо пов’язані сутності
    });

    return { data, total };
  }

  async findAll(): Promise<ProductAttribute[]> {
    return this.productAttributeRepository.find({
      relations: ['product', 'attribute'],
    });
  }

  async findOne(id: number): Promise<ProductAttribute> {
    return this.productAttributeRepository.findOneOrFail({
      where: { id },
      relations: ['product', 'attribute'],
    });
  }

  async update(
    id: number,
    updateProductAttributeDto: Partial<CreateProductAttributeDto>,
  ): Promise<ProductAttribute> {
    const productAttribute = await this.findOne(id);
    const { productId, attributeId } = updateProductAttributeDto;

    if (productId) {
      const product = await this.productRepository.findOneOrFail({
        where: { id: productId },
      });
      productAttribute.product = product;
    }

    if (attributeId) {
      const attribute = await this.attributeRepository.findOneOrFail({
        where: { id: attributeId },
      });
      productAttribute.attribute = attribute;
    }

    return this.productAttributeRepository.save(productAttribute);
  }

  async remove(id: number): Promise<void> {
    await this.productAttributeRepository.delete(id);
  }
}
