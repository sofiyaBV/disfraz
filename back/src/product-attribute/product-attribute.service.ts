import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { ProductAttribute } from './entities/product-attribute.entity';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
  ) {}

  async create(createProductAttributeDto: CreateProductAttributeDto): Promise<ProductAttribute> {
    const productAttribute = this.productAttributeRepository.create(createProductAttributeDto);
    return this.productAttributeRepository.save(productAttribute);
  }

  async findAll(): Promise<ProductAttribute[]> {
    return this.productAttributeRepository.find();
  }

  async findOne(id: number): Promise<ProductAttribute> {
    return this.productAttributeRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateProductAttributeDto: Partial<CreateProductAttributeDto>): Promise<ProductAttribute> {
    await this.productAttributeRepository.update(id, updateProductAttributeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productAttributeRepository.delete(id);
  }
}