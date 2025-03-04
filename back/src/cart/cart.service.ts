import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity'; // Импортируем User

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(User) // Внедряем репозиторий User
    private userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { productAttributeId, userId, quantity, price } = createCartDto;

    // Находим ProductAttribute по его ID
    const productAttribute = await this.productAttributeRepository.findOneOrFail({ where: { id: productAttributeId } });
    
    // Находим User по его ID
    const user = await this.userRepository.findOneOrFail({ where: { id: userId } });

    // Создаем новый запис в корзине
    const cart = this.cartRepository.create({
      productAttribute,
      user, // Устанавливаем связь с пользователем
      quantity,
      price: price || productAttribute.product.price, // Используем цену из Product, если price не указан в DTO
    });

    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['productAttribute', 'productAttribute.product', 'productAttribute.attribute', 'user'], // Загружаем связанные сущности, включая User
    });
  }

  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOneOrFail({
      where: { id },
      relations: ['productAttribute', 'productAttribute.product', 'productAttribute.attribute', 'user'], // Загружаем User
    });
  }

  async update(id: number, updateCartDto: Partial<CreateCartDto>): Promise<Cart> {
    const cart = await this.findOne(id);
    const { productAttributeId, userId, quantity, price } = updateCartDto;

    if (productAttributeId) {
      const productAttribute = await this.productAttributeRepository.findOneOrFail({ where: { id: productAttributeId } });
      cart.productAttribute = productAttribute;
    }

    if (userId) {
      const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
      cart.user = user; // Обновляем связь с пользователем
    }

    if (quantity !== undefined) {
      cart.quantity = quantity;
    }

    if (price !== undefined) {
      cart.price = price;
    }

    return this.cartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }
}