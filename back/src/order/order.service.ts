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

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException(
        `Корзина для пользователя с ID ${userId} пуста или не найдена`,
      );
    }

    const createdOrders: Order[] = [];

    for (const cart of cartItems) {
      const order = this.orderRepository.create({
        ...createOrderDto,
        cart,
        cartId: cart.id,
        user,
        createdAt: new Date(),
        status: createOrderDto.status || 'Pending', // Устанавливаем статус из DTO или по умолчанию
      });

      const savedOrder = await this.orderRepository.save(order);
      createdOrders.push(savedOrder);
    }

    return createdOrders;
  }

  async findAllWithPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.orderRepository.findAndCount({
      skip,
      take: limit,
      relations: ['cart', 'user'],
    });

    return { data, total };
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
      throw new NotFoundException(`Заказ с ID ${id} не найден`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Проверяем, существует ли заказ
    const order = await this.findOne(id);

    // Если обновляется cartId, проверяем, существует ли корзина
    if (updateOrderDto.cartId) {
      const cart = await this.cartRepository.findOne({
        where: { id: updateOrderDto.cartId },
      });
      if (!cart) {
        throw new NotFoundException(
          `Корзина с ID ${updateOrderDto.cartId} не найдена`,
        );
      }
    }

    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
