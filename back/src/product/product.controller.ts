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
  ApiConsumes,
  ApiOkResponse,
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
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { productPaginateConfig } from '../config/pagination.config';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Створити новий Product' })
  @ApiResponse({
    status: 201,
    description: 'Product успішно створений',
    type: Product,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Створити Product із зображеннями',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Костюм супергероя',
          description: 'Назва товару',
        },
        price: { type: 'number', example: 199.99, description: 'Ціна товару' },
        discount: {
          type: 'number',
          example: 25,
          description: 'Знижка на товар у відсотках (опціонально)',
        },
        topSale: {
          type: 'boolean',
          example: true,
          description: 'Чи є товар топовим у продажу (опціонально)',
        },
        description: {
          type: 'string',
          example: 'Костюм для косплею',
          description: 'Опис товару',
        },
        similarProductIds: {
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('=== CREATE PRODUCT ===');
    console.log('Received body:', body);
    console.log('Uploaded files:', files?.length || 0);

    const createProductDto = plainToClass(CreateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      discount: body.discount ? parseFloat(body.discount) : undefined,
      topSale:
        body.topSale !== undefined
          ? body.topSale === 'true' || body.topSale === true
          : undefined,
    });

    console.log('Transformed createProductDto:', createProductDto);

    const errors = await validate(createProductDto);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    const result = await this.productService.create(createProductDto, files);
    console.log('Create result:', result);
    return result;
  }

  @ApiOperation({ summary: 'Отримати всі Products' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх Products',
  })
  @PaginatedSwaggerDocs(CreateProductDto, productPaginateConfig)
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productService.findAllPag(query);
  }

  @ApiOperation({ summary: 'Отримати Product за ID' })
  @ApiResponse({ status: 200, description: 'Product знайдений', type: Product })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Оновити Product за ID' })
  @ApiResponse({
    status: 200,
    description: 'Product успішно оновлений',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Оновити Product із зображеннями',
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
        discount: {
          type: 'number',
          example: 25,
          description: 'Знижка на товар у відсотках (опціонально)',
        },
        topSale: {
          type: 'boolean',
          example: true,
          description: 'Чи є товар топовим у продажу (опціонально)',
        },
        description: {
          type: 'string',
          example: 'Костюм для косплею',
          description: 'Опис товару (опціонально)',
        },
        similarProductIds: {
          type: 'array',
          items: { type: 'integer' },
          example: [5, 7],
          description: 'Список ID схожих товарів (опціонально)',
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log(`=== UPDATE PRODUCT ${id} ===`);
    console.log('Raw body:', body);
    console.log('Files count:', files?.length || 0);

    const updateProductDto = plainToClass(UpdateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      discount: body.discount ? parseFloat(body.discount) : undefined,
      topSale:
        body.topSale !== undefined
          ? body.topSale === 'true' || body.topSale === true
          : undefined,
    });

    console.log('Transformed DTO:', updateProductDto);

    const errors = await validate(updateProductDto);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    const result = await this.productService.update(
      id,
      updateProductDto,
      files,
    );
    console.log('Update result:', result);
    return result;
  }

  @ApiOperation({ summary: 'Видалити Product за ID' })
  @ApiResponse({ status: 200, description: 'Product успішно видалений' })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log(`=== DELETE PRODUCT ${id} ===`);
    const result = await this.productService.remove(id);
    console.log('Delete completed');
    return result;
  }
}
