import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeRepository.find();
  }

  async findOne(id: number): Promise<Attribute> {
    return this.attributeRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    await this.attributeRepository.update(id, updateAttributeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.attributeRepository.delete(id);
  }

  // Пошук атрибутів за типом (зараз за булевими полями)
  async findByType(type: 'material' | 'size' | 'theme' | 'bodyPart' | 'isSet' | 'additionalInfo' | 'inStock'): Promise<Attribute[]> {
    const field = `is${type.charAt(0).toUpperCase() + type.slice(1)}`; // Наприклад, isMaterial, isSize тощо
    return this.attributeRepository.find({ where: { [field]: true } });
  }

  // Пошук атрибутів за назвою
  async findByName(name: string): Promise<Attribute> {
    return this.attributeRepository.findOne({ where: { name } });
  }
  
}