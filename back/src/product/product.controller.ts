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
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create product with images',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Костюм супергероя',
          description: 'Назва товару',
        },
        price: { type: 'number', example: 199.99, description: 'Ціна товару' },
        description: {
          type: 'string',
          example: 'Костюм для косплею',
          description: 'Опис товару',
        },
        similarProducts: {
          type: 'array',
          items: { type: 'integer' },
          example: [5, 7],
          description: 'Список ID схожих товарів',
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Файли зображень (до 10 файлів)',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() body: any, // Принимаем body как any, так как это multipart/form-data
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('Received body:', body);
    console.log('Uploaded files:', files);

    // Преобразуем body в CreateProductDto
    const createProductDto = plainToClass(CreateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined, // Преобразуем price в число
    });

    // Валидируем DTO
    const errors = await validate(createProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    console.log('Transformed createProductDto:', createProductDto);
    return this.productService.create(createProductDto, files);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' },
        },
        total: { type: 'number', description: 'Загальна кількість продуктів' },
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
  ): Promise<PaginationResponse<Product>> {
    const { data, total } = await this.productService.findAllPag(page, limit);
    return {
      data,
      total,
      page,
      limit,
    };
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
  @Roles(Role.User, Role.Admin)
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update product with images',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Костюм супергероя',
          description: 'Назва товару (опціонально)',
        },
        price: {
          type: 'number',
          example: 199.99,
          description: 'Ціна товару (опціонально)',
        },
        description: {
          type: 'string',
          example: 'Костюм для косплею',
          description: 'Опис товару (опціонально)',
        },
        similarProducts: {
          type: 'array',
          items: { type: 'integer' },
          example: [5, 7],
          description: 'Список ID схожих товарів (опціонально)',
        },
        attributeIds: {
          type: 'array',
          items: { type: 'integer' },
          example: [1, 2],
          description: 'Список ID атрибутів товару (опціонально)',
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Файли зображень (до 10 файлів, опціонально)',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10))
  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any, // Принимаем body как any, так как это multipart/form-data
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log(`Received body for update: ${id}, body:`, body);
    console.log('Uploaded files:', files);

    // Преобразуем body в UpdateProductDto
    const updateProductDto = plainToClass(UpdateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined, // Преобразуем price в число
      attributeIds: body.attributeIds
        ? body.attributeIds.split(',').map(Number)
        : undefined, // Преобразуем attributeIds в массив чисел
    });

    // Валидируем DTO
    const errors = await validate(updateProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    console.log('Transformed updateProductDto:', updateProductDto);
    return this.productService.update(id, updateProductDto, files);
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
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
