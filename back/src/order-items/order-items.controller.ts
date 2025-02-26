import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { OrderItem } from './entities/order-item.entity';

@ApiTags('Order Items')
@Controller('order-items')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({
    status: 201,
    description: 'Order item successfully created',
    type: OrderItem,
  })
  @ApiBody({ type: CreateOrderItemDto })
  @Post()
  @Roles(Role.Admin, Role.User) // Доступ для адміна та користувача для створення елементів замовлення
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @ApiOperation({ summary: 'Get all order items' })
  @ApiResponse({
    status: 200,
    description: 'List of all order items',
    type: [OrderItem],
  })
  @Get()
  @Roles(Role.User, Role.Admin) // Доступ для користувача та адміна для перегляду всіх елементів
  findAll() {
    return this.orderItemsService.findAll();
  }

  @ApiOperation({ summary: 'Get an order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item found', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order item ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin) // Доступ для користувача та адміна для перегляду елемента
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an order item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order item updated successfully',
    type: OrderItem,
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiBody({ type: UpdateOrderItemDto })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order item ID',
    example: 1,
  })
  @Put(':id')
  @Roles(Role.Admin) // Тільки адмін може оновлювати елементи замовлення
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @ApiOperation({ summary: 'Delete an order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order item ID',
    example: 1,
  })
  @Delete(':id')
  @Roles(Role.Admin) // Тільки адмін може видаляти елементи замовлення
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}