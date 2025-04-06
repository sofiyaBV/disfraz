import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedSwaggerDocs } from 'nestjs-paginate';
import { orderPaginateConfig } from '../config/pagination.config';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary:
      'Создать новый заказ для авторизованного пользователя на основе корзины',
  })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: Order, // Изменили на один Order
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Включает данные для создания заказа',
  })
  @Post()
  @Roles(Role.User, Role.Admin)
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: any) {
    return this.orderService.create(createOrderDto, user.id);
  }

  @ApiOperation({ summary: 'Получить все заказы' })
  @ApiResponse({
    status: 200,
    description: 'Список всех заказов с пользователями',
  })
  @PaginatedSwaggerDocs(CreateOrderDto, orderPaginateConfig)
  @Get()
  @Roles(Role.Admin)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return this.orderService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({
    status: 200,
    description: 'Заказ найден с пользователем',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID заказа',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновить заказ по ID' })
  @ApiResponse({
    status: 200,
    description: 'Заказ успешно обновлен',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Данные для обновления заказа',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID заказа',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Удалить заказ по ID' })
  @ApiResponse({ status: 200, description: 'Заказ успешно удален' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID заказа',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
