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
import { Cart } from './/entities/cart.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart successfully created',
    type: Cart,
  })
  @ApiBody({ type: CreateCartDto })
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'List of all carts', type: [Cart] })
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart found', type: Cart })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiParam({ name: 'id', required: true, description: 'Cart ID', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiBody({ type: UpdateCartDto })
  @ApiParam({ name: 'id', required: true, description: 'Cart ID', example: 1 })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiParam({ name: 'id', required: true, description: 'Cart ID', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
