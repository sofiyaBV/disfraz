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
    private readonly entityManager: EntityManager, // Добавляем EntityManager для транзакций
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
      // Находим атрибут
      const attribute = await manager.findOne(Attribute, {
        where: { id },
        relations: ['products'],
      });

      if (!attribute) {
        throw new NotFoundException(`Атрибут с ID ${id} не найден`);
      }

      // Обновляем базовые поля
      manager.merge(Attribute, attribute, updateAttributeDto);

      // Обновляем связи с продуктами, если переданы productIds
      if (updateAttributeDto.productIds) {
        const products = await manager.findByIds(
          Product,
          updateAttributeDto.productIds,
        );
        if (products.length !== updateAttributeDto.productIds.length) {
          throw new NotFoundException('Некоторые продукты не найдены');
        }
        attribute.products = products;
      }

      // Сохраняем изменения
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

  // Пошук атрибутів за типом (за текстовими полями)
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

  // Пошук атрибутів за назвою
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
