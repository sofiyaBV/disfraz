import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AttributesService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Attribute } from './entities/attribute.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { attributePaginateConfig } from '../config/pagination.config';

@SkipThrottle()
@ApiTags('Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Створити новий Attribute' })
  @ApiBody({ type: CreateAttributeDto })
  @ApiResponse({
    status: 201,
    description: 'Attribute успішно створено',
    type: Attribute,
  })
  async create(
    @Body() createAttributeDto: CreateAttributeDto,
  ): Promise<Attribute> {
    return this.attributesService.create(createAttributeDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всі Attributes' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх Attributes',
  })
  @PaginatedSwaggerDocs(CreateAttributeDto, attributePaginateConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Attribute>> {
    return this.attributesService.findAllPag(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати Attribute за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Attribute знайдено',
    type: Attribute,
  })
  @ApiResponse({ status: 404, description: 'Attribute не знайдено' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Attribute> {
    return this.attributesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Оновити Attribute за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @ApiBody({ type: UpdateAttributeDto })
  @ApiResponse({
    status: 200,
    description: 'Attribute успішно оновлено',
    type: Attribute,
  })
  @ApiResponse({ status: 404, description: 'Attribute не знайдено' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    return this.attributesService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалити Attribute за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Attribute успішно видалено' })
  @ApiResponse({ status: 404, description: 'Attribute не знайдено' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attributesService.remove(id);
  }
}
