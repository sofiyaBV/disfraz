import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ProductAttribute } from './entities/product-attribute.entity';

interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@ApiTags('Product Attributes')
@Controller('product-attribute')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @ApiOperation({ summary: 'Create a new product-attribute link' })
  @ApiResponse({
    status: 201,
    description: 'Product-attribute link successfully created',
    type: ProductAttribute,
  })
  @ApiBody({ type: CreateProductAttributeDto })
  @Post()
  @Roles(Role.Admin, Role.User)
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @ApiOperation({ summary: 'Get all product-attribute links ' })
  @ApiResponse({
    status: 200,
    description: 'List of all product-attribute links ',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductAttribute' },
        },
        total: { type: 'number', description: 'Загальна кількість зв’язків' },
        page: { type: 'number', description: 'Поточна сторінка' },
        limit: { type: 'number', description: 'Кількість записів на сторінку' },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Номер сторінки',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Кількість записів на сторінку',
  })
  @Get()
  @Roles(Role.User, Role.Admin)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<ProductAttribute>> {
    const { data, total } = await this.productAttributeService.findAllPag(
      page,
      limit,
    );
    return {
      data,
      total,
      page,
      limit,
    };
  }

  @ApiOperation({ summary: 'Get a product-attribute link by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute link found',
    type: ProductAttribute,
  })
  @ApiResponse({ status: 404, description: 'Product-attribute link not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product-attribute link ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a product-attribute link by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute link updated successfully',
    type: ProductAttribute,
  })
  @ApiResponse({ status: 404, description: 'Product-attribute link not found' })
  @ApiBody({ type: UpdateProductAttributeDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product-attribute link ID',
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

  @ApiOperation({ summary: 'Delete a product-attribute link by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product-attribute link deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product-attribute link not found' })
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
