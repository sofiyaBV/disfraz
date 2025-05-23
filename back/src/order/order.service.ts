import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { orderPaginateConfig } from '../config/pagination.config';

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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Користувач з ID ${userId} не знайдено`);
    }

    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'productAttribute'],
    });

    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException(
        `Кошик для користувача з ID ${userId} порожньо або не знайдено`,
      );
    }

    // Збираємо всі productAttributeIds з кошика в масив
    const productAttributeIds = cartItems.map(
      (cart) => cart.productAttribute.id,
    );

    // Підсумовуємо quantity і price з усіх записів кошика
    const totalQuantity = cartItems.reduce(
      (sum, cart) => sum + cart.quantity,
      0,
    );
    const totalPrice = cartItems.reduce(
      (sum, cart) => sum + Number(cart.price),
      0,
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      productAttributeIds,
      quantity: totalQuantity,
      price: totalPrice,
      user,
      createdAt: new Date(),
      status: createOrderDto.status || 'Pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    //  очищаємо кошик після створення замовлення
    await this.cartRepository.delete({ user: { id: userId } });

    return savedOrder;
  }

  async findAllWithPagination(query: PaginateQuery): Promise<Paginated<Order>> {
    return paginate<Order>(query, this.orderRepository, orderPaginateConfig);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException(`Заказ с ID ${id} не найден`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.delete(id);
  }
}
