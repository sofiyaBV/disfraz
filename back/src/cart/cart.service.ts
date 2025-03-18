import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto, userId: number): Promise<Cart> {
    const { productAttributeId, quantity, price } = createCartDto;

    const productAttribute =
      await this.productAttributeRepository.findOneOrFail({
        where: { id: productAttributeId },
      });

    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const cart = this.cartRepository.create({
      productAttribute,
      user,
      quantity: quantity || 1,
      price: price || productAttribute.product.price,
    });

    return this.cartRepository.save(cart);
  }

  async findAllPag(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.cartRepository.findAndCount({
      skip,
      take: limit,
      relations: [
        'productAttribute',
        'productAttribute.product',
        'productAttribute.attribute',
        'user',
      ], // Завантажуємо пов’язані сутності
    });

    return { data, total };
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: [
        'productAttribute',
        'productAttribute.product',
        'productAttribute.attribute',
        'user',
      ],
    });
  }

  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOneOrFail({
      where: { id },
      relations: [
        'productAttribute',
        'productAttribute.product',
        'productAttribute.attribute',
        'user',
      ],
    });
  }

  async update(
    id: number,
    updateCartDto: Partial<CreateCartDto>,
  ): Promise<Cart> {
    const cart = await this.findOne(id);
    const { productAttributeId, quantity, price } = updateCartDto;

    if (productAttributeId) {
      const productAttribute =
        await this.productAttributeRepository.findOneOrFail({
          where: { id: productAttributeId },
        });
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
