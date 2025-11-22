import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(AttributesService.name);

  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    const savedAttribute = await this.attributeRepository.save(attribute);

    this.logger.log(`Attribute created: ${savedAttribute.id}`);

    return savedAttribute;
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
      throw new NotFoundException(`Атрибут з ID ${id} не знайдено`);
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
        throw new NotFoundException(`Атрибут з ID ${id} не знайдено`);
      }

      manager.merge(Attribute, attribute, updateAttributeDto);
      await manager.save(attribute);

      this.logger.log(`Attribute updated: ${id}`);

      return attribute;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.attributeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Атрибут з ID ${id} не знайдено`);
    }

    this.logger.log(`Attribute deleted: ${id}`);
  }

  async findByType(
    type: 'material' | 'size' | 'theme' | 'bodyPart' | 'isSet' | 'description',
  ): Promise<Attribute[]> {
    const validTypes = [
      'material',
      'size',
      'theme',
      'bodyPart',
      'isSet',
      'description',
    ];

    if (!validTypes.includes(type)) {
      throw new BadRequestException('Недопустимий тип атрибуту');
    }

    if (type === 'isSet') {
      return this.attributeRepository.find({ where: { isSet: true } });
    }

    return this.attributeRepository.find({ where: { [type]: Not(IsNull()) } });
  }
}
