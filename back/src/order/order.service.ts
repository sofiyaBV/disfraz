import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity'; // Импортируем Cart

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>, // Добавляем репозиторий для Cart
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Если передан cartId, проверяем, существует ли такая корзина
    let cart: Cart | null = null;
    if (createOrderDto.cartId) {
      cart = await this.cartRepository.findOne({
        where: { id: createOrderDto.cartId },
      });
      if (!cart) {
        throw new NotFoundException(
          `Cart with ID ${createOrderDto.cartId} not found`,
        );
      }
    }

    // Создаем заказ
    const order = this.orderRepository.create({
      ...createOrderDto,
      cart, // Связываем с корзиной
    });
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['cart'] }); // Загружаем связанные данные о корзине
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cart'], // Загружаем связанные данные о корзине
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Если обновляется cartId, проверяем, существует ли такая корзина
    let cart: Cart | null = null;
    if (updateOrderDto.cartId) {
      cart = await this.cartRepository.findOne({
        where: { id: updateOrderDto.cartId },
      });
      if (!cart) {
        throw new NotFoundException(
          `Cart with ID ${updateOrderDto.cartId} not found`,
        );
      }
    }

    // Обновляем заказ
    await this.orderRepository.update(id, {
      ...updateOrderDto,
      cart, // Обновляем связь с корзиной
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
