import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { cartPaginateConfig } from '../config/pagination.config';

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
    const { productAttributeId, quantity } = createCartDto;

    const productAttribute =
      await this.productAttributeRepository.findOneOrFail({
        where: { id: productAttributeId },
        relations: ['product'],
      });

    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    // Визначаємо ціну: беремо newPrice, якщо є знижка, інакше price
    const priceToUse =
      productAttribute.product.discount > 0 &&
      productAttribute.product.newPrice !== null
        ? productAttribute.product.newPrice
        : productAttribute.product.price;

    const cart = this.cartRepository.create({
      productAttribute,
      user,
      quantity: quantity || 1,
      price: priceToUse * (quantity || 1), // Множимо на кількість
    });

    return this.cartRepository.save(cart);
  }

  async findAllPag(query: PaginateQuery): Promise<Paginated<Cart>> {
    return paginate<Cart>(query, this.cartRepository, cartPaginateConfig);
  }

  async findByUserId(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: [
        'productAttribute',
        'productAttribute.product',
        'productAttribute.attribute',
      ],
    });
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
    const { productAttributeId, quantity } = updateCartDto;

    if (productAttributeId) {
      const productAttribute =
        await this.productAttributeRepository.findOneOrFail({
          where: { id: productAttributeId },
          relations: ['product'],
        });
      cart.productAttribute = productAttribute;

      // Оновлюємо ціну: беремо newPrice, якщо є знижка, інакше price
      const priceToUse =
        productAttribute.product.discount > 0 &&
        productAttribute.product.newPrice !== null
          ? productAttribute.product.newPrice
          : productAttribute.product.price;
      cart.price = priceToUse * (cart.quantity || 1);
    }

    if (quantity !== undefined) {
      cart.quantity = quantity;

      // Перераховуємо ціну при зміні кількості
      const priceToUse =
        cart.productAttribute.product.discount > 0 &&
        cart.productAttribute.product.newPrice !== null
          ? cart.productAttribute.product.newPrice
          : cart.productAttribute.product.price;
      cart.price = priceToUse * quantity;
    }

    return this.cartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }

  async clearByUserId(userId: number): Promise<void> {
    await this.cartRepository.delete({ user: { id: userId } });
  }
}
