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

  // Метод для создания заказа на основе записей корзины авторизованного пользователя
  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order[]> {
    // Находим пользователя по userId из JWT
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Находим все записи корзины, связанные с этим пользователем
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } }, // Ищем корзины по userId
      relations: ['user'], // Загружаем связанные данные о пользователе
    });

    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException(
        `Корзина для пользователя с ID ${userId} пуста или не найдена`,
      );
    }

    // Массив для хранения созданных заказов
    const createdOrders: Order[] = [];

    // Проходим по всем записям корзины и создаем заказы
    for (const cart of cartItems) {
      const order = this.orderRepository.create({
        ...createOrderDto, // Данные из DTO (например, customerName, customerEmail и т.д.)
        cart, // Связываем заказ с корзиной
        cartId: cart.id, // Явно задаем cartId
        user, // Связываем заказ с пользователем
        createdAt: new Date(), // Устанавливаем дату создания
        status: 'Pending', // Устанавливаем статус по умолчанию
      });

      // Сохраняем заказ в базе данных
      const savedOrder = await this.orderRepository.save(order);
      createdOrders.push(savedOrder);
    }

    return createdOrders; // Возвращаем массив созданных заказов
  }

  // Получение всех заказов
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['cart', 'user'] });
  }

  // Получение заказа по ID
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

  // Обновление заказа
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Убираем проверку cartId, так как он больше не входит в UpdateOrderDto
    await this.orderRepository.update(id, {
      ...updateOrderDto,
    });
    return this.findOne(id);
  }

  // Удаление заказа
  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
