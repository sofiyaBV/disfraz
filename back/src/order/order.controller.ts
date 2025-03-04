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
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: Order,
  })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  @Roles(Role.User, Role.Admin) // Доступ для пользователей и админов
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  @Get()
  @Roles(Role.Admin) // Только админ может видеть все заказы
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin) // Доступ только для зарегистрированных пользователей
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin) // Только админ может обновлять заказ
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin) // Только админ может удалять заказ
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
