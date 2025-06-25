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
import { AttributesService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Attribute } from './entities/attribute.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { attributePaginateConfig } from '../config/pagination.config';

@ApiTags('Attributes')
@Controller('attributes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @ApiOperation({ summary: 'Створити новий Attribute' })
  @ApiResponse({
    status: 201,
    description: 'Attribute успішно створений',
    type: Attribute,
  })
  @ApiBody({ type: CreateAttributeDto })
  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() createAttributeDto: CreateAttributeDto,
  ): Promise<Attribute> {
    console.log('Creating attribute with body:', createAttributeDto);
    return this.attributesService.create(createAttributeDto);
  }

  @ApiOperation({ summary: 'Отримати всі Attributes' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх Attributes',
  })
  @PaginatedSwaggerDocs(CreateAttributeDto, attributePaginateConfig)
  @Get()
  // @Roles(Role.User, Role.Admin)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Attribute>> {
    return this.attributesService.findAllPag(query);
  }

  @ApiOperation({ summary: 'Отримати Attribute за ID' })
  @ApiResponse({
    status: 200,
    description: 'Attribute знайдений',
    type: Attribute,
  })
  @ApiResponse({ status: 404, description: 'Attribute не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @Get(':id')
  // @Roles(Role.User, Role.Admin)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Attribute> {
    return this.attributesService.findOne(id);
  }

  @ApiOperation({ summary: 'Оновити Attribute за ID' })
  @ApiResponse({
    status: 200,
    description: 'Attribute успішно оновлений',
    type: Attribute,
  })
  @ApiResponse({ status: 404, description: 'Attribute не знайдений' })
  @ApiBody({ type: UpdateAttributeDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    console.log(`Updating attribute with id: ${id}, body:`, updateAttributeDto);
    return this.attributesService.update(id, updateAttributeDto);
  }

  @ApiOperation({ summary: 'Видалити Attribute за ID' })
  @ApiResponse({ status: 200, description: 'Attribute успішно видалений' })
  @ApiResponse({ status: 404, description: 'Attribute не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Attribute',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attributesService.remove(id);
  }
}
