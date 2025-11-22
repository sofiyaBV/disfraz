import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { User } from '../auth/decorators/user.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { cartPaginateConfig } from '../config/pagination.config';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Додати товар до кошика' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({
    status: 201,
    description: 'Кошик успішно створений',
    type: Cart,
  })
  async create(@Body() createCartDto: CreateCartDto, @User() user: any) {
    return this.cartService.create(createCartDto, user.id);
  }

  @Get('my')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Отримати кошик поточного користувача' })
  @ApiResponse({ status: 200, description: 'Кошик користувача', type: [Cart] })
  async getMyCart(@User() user: any): Promise<Cart[]> {
    return this.cartService.findByUserId(user.id);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Отримати всі кошики' })
  @ApiResponse({
    status: 200,
    description: 'Список усіх кошиків',
  })
  @PaginatedSwaggerDocs(CreateCartDto, cartPaginateConfig)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Cart>> {
    return this.cartService.findAllPag(query);
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Отримати кошик за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Кошик знайдений', type: Cart })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Оновити кошик за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({
    status: 200,
    description: 'Кошик успішно оновлений',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Видалити кошик за ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID кошика',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Кошик успішно видалений' })
  @ApiResponse({ status: 404, description: 'Кошик не знайдений' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
