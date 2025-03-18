import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Создать новую корзину для авторизованного пользователя',
  })
  @ApiResponse({
    status: 201,
    description: 'Корзина успешно создана',
    type: Cart,
  })
  @ApiBody({ type: CreateCartDto })
  @Post()
  async create(@Body() createCartDto: CreateCartDto, @User() user: any) {
    return this.cartService.create(createCartDto, user.id);
  }

  @ApiOperation({ summary: 'Получить все корзины ' })
  @ApiResponse({
    status: 200,
    description: 'Список всех корзин ',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Cart' } },
        total: { type: 'number', description: 'Загальна кількість корзин' },
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
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponse<Cart>> {
    const { data, total } = await this.cartService.findAllPag(page, limit);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  @ApiOperation({ summary: 'Получить корзину по ID' })
  @ApiResponse({ status: 200, description: 'Корзина найдена', type: Cart })
  @ApiResponse({ status: 404, description: 'Корзина не найдена' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID корзины',
    example: 1,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить корзину по ID' })
  @ApiResponse({
    status: 200,
    description: 'Корзина успешно обновлена',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Корзина не найдена' })
  @ApiBody({ type: UpdateCartDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID корзины',
    example: 1,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @ApiOperation({ summary: 'Удалить корзину по ID' })
  @ApiResponse({ status: 200, description: 'Корзина успешно удалена' })
  @ApiResponse({ status: 404, description: 'Корзина не найдена' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID корзины',
    example: 1,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
