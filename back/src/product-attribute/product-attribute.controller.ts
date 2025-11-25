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
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductAttribute } from './entities/product-attribute.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { productAttributePaginateConfig } from '../config/pagination.config';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { Public } from '../auth/decorators/public.decorator';

@SkipThrottle()
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
  @ApiOperation({ summary: 'Створити новий product-attribute' })
  @ApiBody({ type: CreateProductAttributeDto })
  @ApiResponse({
    status: 201,
    description: 'Product-attribute успішно створено',
    type: ProductAttribute,
  })
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всі product-attribute' })
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID product-attribute',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute знайдено',
    type: ProductAttribute,
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute не знайдено',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributeService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Оновити product-attribute за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID product-attribute',
    example: 1,
  })
  @ApiBody({ type: UpdateProductAttributeDto })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute успішно оновлено',
    type: ProductAttribute,
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute не знайдено',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.productAttributeService.update(id, updateProductAttributeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалити product-attribute за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID product-attribute',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'Product-attribute не знайдено',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributeService.remove(id);
  }
}
