import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: Product,
  })
  @ApiBody({ type: CreateProductDto })
  @Post()
  @Roles(Role.Admin) // Ограничиваем создание только для админов
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    console.log('Creating product with body:', createProductDto);
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [Product],
  })
  @Get()
  @Roles(Role.User, Role.Admin) // Доступ для пользователей и админов
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin) // Доступ для зарегистрированных пользователей
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({ type: UpdateProductDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin, Role.User) // Ограничиваем обновление только для админов
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    console.log(`Updating product with id: ${id}, body:`, updateProductDto);
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin) // Только админ может удалять продукт
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
