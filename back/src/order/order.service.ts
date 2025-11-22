import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { orderPaginateConfig } from '../config/pagination.config';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    return this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`Користувача з ID ${userId} не знайдено`);
      }

      const cartItems = await manager.find(Cart, {
        where: { user: { id: userId } },
        relations: ['user', 'productAttribute'],
      });

      if (!cartItems || cartItems.length === 0) {
        throw new NotFoundException(
          `Кошик для користувача з ID ${userId} порожній або не знайдено`,
        );
      }

      const productAttributeIds = cartItems.map(
        (cart) => cart.productAttribute.id,
      );

      const totalQuantity = cartItems.reduce(
        (sum, cart) => sum + cart.quantity,
        0,
      );

      const totalPrice = cartItems.reduce(
        (sum, cart) => sum + Number(cart.price),
        0,
      );

      const order = manager.create(Order, {
        ...createOrderDto,
        productAttributeIds,
        quantity: totalQuantity,
        price: totalPrice,
        user,
        status: createOrderDto.status || 'Pending',
      });

      const savedOrder = await manager.save(Order, order);

      await manager.delete(Cart, { user: { id: userId } });

      this.logger.log(`Order created: ${savedOrder.id} for user: ${userId}`);

      return savedOrder;
    });
  }

  async findAllWithPagination(query: PaginateQuery): Promise<Paginated<Order>> {
    return paginate<Order>(query, this.orderRepository, orderPaginateConfig);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id);
    await this.orderRepository.update(id, updateOrderDto);

    this.logger.log(`Order updated: ${id}`);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.orderRepository.delete(id);

    this.logger.log(`Order deleted: ${id}`);
  }
}
