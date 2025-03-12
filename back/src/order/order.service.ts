import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    let cart: Cart | null = null;
    let user: User | null = null;

    // Проверяем cartId, если он передан
    if (createOrderDto.cartId) {
      cart = await this.cartRepository.findOne({
        where: { id: createOrderDto.cartId },
      });
      if (!cart) {
        throw new NotFoundException(
          `Cart with ID ${createOrderDto.cartId} not found`,
        );
      }
      // Автоматически берем userId из корзины, если он доступен (для проверки)
      if (cart.user && cart.user.id && !userId) {
        userId = cart.user.id;
      }
    }

    // Находим User по userId из JWT
    user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Создаем заказ
    const order = this.orderRepository.create({
      ...createOrderDto,
      cart,
      user, // Связываем с пользователем из JWT
    });
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['cart', 'user'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['cart', 'user'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    let cart: Cart | null = null;

    // Проверяем cartId, если он передан
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
      cart,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
