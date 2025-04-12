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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { cartPaginateConfig } from '../config/pagination.config';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Створити новий кошик для авторизованого користувача',
  })
  @ApiResponse({
    status: 201,
    description: 'Кошик успішно створений',
    type: Cart,
  })
  @ApiBody({ type: CreateCartDto })
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @User() user: any) {
    return this.cartService.create(createCartDto, user.id);
  }

  @ApiOperation({ summary: 'Отримати всі кошики' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх кошиків',
  })
  @PaginatedSwaggerDocs(CreateCartDto, cartPaginateConfig)
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Cart>> {
    return this.cartService.findAllPag(query);
  }

  @ApiOperation({ summary: 'Отримати кошик за ID' })
  @ApiResponse({ status: 200, description: 'Кошик знайдений', type: Cart })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @ApiOperation({ summary: 'Оновити кошик за ID' })
  @ApiResponse({
    status: 200,
    description: 'Кошик успішно оновлений',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  @ApiBody({ type: UpdateCartDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @ApiOperation({ summary: 'Видалити кошик за ID' })
  @ApiResponse({ status: 200, description: 'Кошик успішно видалений' })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
