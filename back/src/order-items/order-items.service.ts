import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity, price } = createOrderItemDto;

    // Знаходимо Order за ID
    const order = await this.orderRepository.findOneOrFail({ where: { id: orderId } });
    // Знаходимо Product за ID
    const product = await this.productRepository.findOneOrFail({ where: { id: productId } });

    // Створюємо новий OrderItem із зв’язками
    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity,
      price,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      relations: ['order', 'product'], // Завантажуємо пов’язані сутності
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    return this.orderItemRepository.findOneOrFail({
      where: { id },
      relations: ['order', 'product'],
    });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    await this.orderItemRepository.update(id, updateOrderItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}