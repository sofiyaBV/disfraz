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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { productPaginateConfig } from '../config/pagination.config';
import { Public } from '../auth/decorators/public.decorator';

// ВАЖЛИВО: Вимкнути rate limiting для адмін-панелі
@SkipThrottle()
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Створити новий Product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product успішно створений',
    type: Product,
  })
  async create(
    @Body() body: Record<string, any>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    const createProductDto = plainToClass(CreateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      discount: body.discount ? parseFloat(body.discount) : undefined,
      topSale:
        body.topSale !== undefined
          ? body.topSale === 'true' || body.topSale === true
          : undefined,
    });

    const errors = await validate(createProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    return this.productService.create(createProductDto, files);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всі Products' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх Products',
  })
  @PaginatedSwaggerDocs(CreateProductDto, productPaginateConfig)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    return this.productService.findAllPag(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати Product за ID' })
  @ApiResponse({ status: 200, description: 'Product знайдений', type: Product })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Оновити Product за ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product успішно оновлений',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, any>,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    const updateProductDto = plainToClass(UpdateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      discount: body.discount ? parseFloat(body.discount) : undefined,
      topSale:
        body.topSale !== undefined
          ? body.topSale === 'true' || body.topSale === true
          : undefined,
    });

    const errors = await validate(updateProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    return this.productService.update(id, updateProductDto, files);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Видалити Product за ID' })
  @ApiResponse({ status: 200, description: 'Product успішно видалений' })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
