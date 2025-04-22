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
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Створити новий Product' })
  @ApiResponse({
    status: 201,
    description: 'Product успішно створений',
    type: Product,
  })
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
  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('Received body:', body);
    console.log('Uploaded files:', files);

    const createProductDto = plainToClass(CreateProductDto, {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
    });

    const errors = await validate(createProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: ' + JSON.stringify(errors),
      );
    }

    console.log('Transformed createProductDto:', createProductDto);
    return this.productService.create(createProductDto, files);
  }

  @ApiOperation({ summary: 'Отримати всі Products' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх Products',
  })
  @PaginatedSwaggerDocs(CreateProductDto, productPaginateConfig)
  @Get()
  // @Roles(Role.User, Role.Admin)
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
  @Roles(Role.User, Role.Admin)
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log(`Отримано тіло для оновлення: ${id}, body:`, updateProductDto);
    console.log('Uploaded files:', files);

    return this.productService.update(id, updateProductDto, files);
  }

  @ApiOperation({ summary: 'Видалити Product за ID' })
  @ApiResponse({ status: 200, description: 'Product успішно видалений' })
  @ApiResponse({ status: 404, description: 'Product не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID Product',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
