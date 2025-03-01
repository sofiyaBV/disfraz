import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttributesService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Attribute } from './entities/attribute.entity';

@ApiTags('Attributes')
@Controller('attributes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({
    status: 201,
    description: 'Attribute successfully created',
    type: Attribute,
  })
  @ApiBody({ type: CreateAttributeDto })
  @Post()
  @Roles(Role.Admin, Role.User) // Тільки адмін може створювати атрибути
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({
    status: 200,
    description: 'List of all attributes',
    type: [Attribute],
  })
  @Get()
  @Roles(Role.User, Role.Admin) // Доступ для користувача та адміна для перегляду всіх атрибутів
  findAll() {
    return this.attributesService.findAll();
  }

  @ApiOperation({ summary: 'Get an attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute found', type: Attribute })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Attribute ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin) // Доступ для користувача та адміна для перегляду атрибута
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an attribute by ID' })
  @ApiResponse({
    status: 200,
    description: 'Attribute updated successfully',
    type: Attribute,
  })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiBody({ type: UpdateAttributeDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Attribute ID',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin) // Тільки адмін може оновлювати атрибути
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(+id, updateAttributeDto);
  }

  @ApiOperation({ summary: 'Delete an attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Attribute ID',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin) // Тільки адмін може видаляти атрибути
  remove(@Param('id') id: string) {
    return this.attributesService.remove(+id);
  }
}