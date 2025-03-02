import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { productAttributeId, quantity, price } = createCartDto;

    // Знаходимо ProductAttribute за його ID
    const productAttribute = await this.productAttributeRepository.findOneOrFail({ where: { id: productAttributeId } });

    // Створюємо новий запис у кошику
    const cart = this.cartRepository.create({
      productAttribute,
      quantity,
      price: price || productAttribute.product.price, // Використовуємо ціну з Product, якщо price не вказано в DTO
    });

    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['productAttribute', 'productAttribute.product', 'productAttribute.attribute'], // Завантажуємо пов’язані сутності
    });
  }

  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOneOrFail({
      where: { id },
      relations: ['productAttribute', 'productAttribute.product', 'productAttribute.attribute'],
    });
  }

  async update(id: number, updateCartDto: Partial<CreateCartDto>): Promise<Cart> {
    const cart = await this.findOne(id);
    const { productAttributeId, quantity, price } = updateCartDto;

    if (productAttributeId) {
      const productAttribute = await this.productAttributeRepository.findOneOrFail({ where: { id: productAttributeId } });
      cart.productAttribute = productAttribute;
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