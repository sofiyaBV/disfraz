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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Убедитесь, что импортирован правильный guard
import { User } from '../auth/decorators/user.decorator'; // Импортируйте декоратор User

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Используем наш кастомный JwtAuthGuard
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
    return this.cartService.create(createCartDto, user.id); // Передаем user.id в сервис
  }

  @ApiOperation({ summary: 'Получить все корзины' })
  @ApiResponse({ status: 200, description: 'Список всех корзин', type: [Cart] })
  @Get()
  findAll() {
    return this.cartService.findAll();
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
