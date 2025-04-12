import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, IsNull } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Product } from '../product/entities/product.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { attributePaginateConfig } from '../config/pagination.config';

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

  async findAllPag(query: PaginateQuery): Promise<Paginated<Attribute>> {
    return paginate<Attribute>(
      query,
      this.attributeRepository,
      attributePaginateConfig,
    );
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
      throw new NotFoundException(`Атрибут з ID ${id} не знайдений`);
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
        throw new NotFoundException(`Атрибут з ID ${id} не знайдений`);
      }

      // Оновлюємо основні поля атрибуту
      manager.merge(Attribute, attribute, updateAttributeDto);

      // Зберігаємо оновлений атрибут
      await manager.save(attribute);
      return attribute;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.attributeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Атрибут з ID ${id} не знайдений`);
    }
  }

  async findByType(
    type:
      | 'material'
      | 'size'
      | 'theme'
      | 'bodyPart'
      | 'isSet'
      | 'description'
      | 'inStock',
  ): Promise<Attribute[]> {
    if (
      ![
        'material',
        'size',
        'theme',
        'bodyPart',
        'isSet',
        'description',
        'inStock',
      ].includes(type)
    ) {
      throw new Error('Недопустимий тип атрибуту');
    }

    const field = type === 'isSet' ? 'isSet' : type;
    if (type === 'isSet') {
      return this.attributeRepository.find({ where: { [field]: true } });
    }
    return this.attributeRepository.find({ where: { [field]: Not(IsNull()) } });
  }
}