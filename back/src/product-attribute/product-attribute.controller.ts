import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
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
import { ProductAttribute } from './entities/product-attribute.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { productAttributePaginateConfig } from '../config/pagination.config';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Product Attributes')
@Controller('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Створіть новий product-attribute' })
  @ApiResponse({
    status: 201,
    description: 'Product-attribute успішно створено',
    type: ProductAttribute,
  })
  @ApiBody({ type: CreateProductAttributeDto })
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всi product-attribute ' })
  @ApiResponse({
    status: 200,
    description: 'Список всіх product-attribute',
  })
  @PaginatedSwaggerDocs(ProductAttributeDto, productAttributePaginateConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ProductAttribute>> {
    return this.productAttributeService.findAllPag(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати product-attribute за ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute  знайдено',
    type: ProductAttribute,
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute  не знайдено',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product-attribute ID',
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Оновлення product-attribute за ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute успішно оновлено',
    type: ProductAttribute,
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute  не знайдено',
  })
  @ApiBody({ type: UpdateProductAttributeDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product-attribute ID',
    example: 1,
  })
  update(
    @Param('id') id: string,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.productAttributeService.update(+id, updateProductAttributeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалення  product-attribute за ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute  не знайдено',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product-attribute link ID',
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(+id);
  }
}
