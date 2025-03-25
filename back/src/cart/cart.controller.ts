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

  @ApiOperation({ summary: 'Получить все корзины' })
  @ApiResponse({
    status: 200,
    description: 'Список всех корзин',
  })
  @PaginatedSwaggerDocs(CreateCartDto, cartPaginateConfig)
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Cart>> {
    return this.cartService.findAllPag(query);
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
