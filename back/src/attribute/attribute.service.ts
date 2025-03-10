import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, IsNull } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!attribute) {
      throw new NotFoundException(`Атрибут с ID ${id} не найден`);
    }
    return attribute;
  }

  async update(
    id: number,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    return this.entityManager.transaction(async (manager) => {
      const attribute = await manager.findOne(Attribute, {
        where: { id },
        relations: ['products'],
      });

      if (!attribute) {
        throw new NotFoundException(`Атрибут с ID ${id} не найден`);
      }

      manager.merge(Attribute, attribute, updateAttributeDto);

      if (updateAttributeDto.productIds) {
        const existingProducts = await manager.findByIds(
          Product,
          updateAttributeDto.productIds,
        );
        if (existingProducts.length > 0) {
          attribute.products = existingProducts; // Устанавливаем только найденные продукты
        } else {
          console.warn(`Ни один продукт не найден для attributeId: ${id}`);
        }
      }

      await manager.save(attribute);
      return attribute;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.attributeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Атрибут с ID ${id} не найден`);
    }
  }

  async findByType(
    type:
      | 'material'
      | 'size'
      | 'theme'
      | 'bodyPart'
      | 'isSet'
      | 'additionalInfo'
      | 'inStock',
  ): Promise<Attribute[]> {
    if (
      ![
        'material',
        'size',
        'theme',
        'bodyPart',
        'isSet',
        'additionalInfo',
        'inStock',
      ].includes(type)
    ) {
      throw new Error('Недопустимый тип атрибута');
    }

    const field = type === 'isSet' ? 'isSet' : type;
    if (type === 'isSet') {
      return this.attributeRepository.find({ where: { [field]: true } });
    }
    return this.attributeRepository.find({ where: { [field]: Not(IsNull()) } });
  }

  async findByName(name: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { name },
    });
    if (!attribute) {
      throw new NotFoundException(`Атрибут с названием ${name} не найден`);
    }
    return attribute;
  }
}
