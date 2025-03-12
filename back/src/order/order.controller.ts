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
import { User } from '../auth/decorators/user.decorator'; // Импортируем декоратор User

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Защищаем все маршруты JWT и ролями
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order for the authenticated user' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: Order,
  })
  @ApiBody({ type: CreateOrderDto, description: 'Includes optional cartId' })
  @Post()
  @Roles(Role.User, Role.Admin)
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: any) {
    return this.orderService.create(createOrderDto, user.id); // Передаем user.id из JWT
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders with their associated carts and users',
    type: [Order],
  })
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.orderService.findAll();
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found with its associated cart and user',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    example: 1,
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin)
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
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Includes optional cartId to update the linked cart',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    example: 1,
  })
  @Patch(':id')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
