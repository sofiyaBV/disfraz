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
import { AuthGuard } from '@nestjs/passport';
import { ProductAttribute } from './entities/product-attribute.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { productAttributePaginateConfig } from '../config/pagination.config';
import { ProductAttributeDto } from './dto/product-attribute.dto';

@ApiTags('Product Attributes')
@Controller('product-attribute')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @ApiOperation({ summary: 'Створіть новий product-attribute' })
  @ApiResponse({
    status: 201,
    description: 'Product-attribute успішно створено',
    type: ProductAttribute,
  })
  @ApiBody({ type: CreateProductAttributeDto })
  @Post()
  @Roles(Role.Admin, Role.User)
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @ApiOperation({ summary: 'Отримати всi product-attribute ' })
  @ApiResponse({
    status: 200,
    description: 'Список всіх product-attribute',
  })
  @PaginatedSwaggerDocs(ProductAttributeDto, productAttributePaginateConfig)
  @Get()
  @Roles(Role.User, Role.Admin)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ProductAttribute>> {
    return this.productAttributeService.findAllPag(query);
  }

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
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Оновлення product-attribute за ID',
  })
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
  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.productAttributeService.update(+id, updateProductAttributeDto);
  }

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
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(+id);
  }
}
