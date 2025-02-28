import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(createCartDto);
    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    await this.cartRepository.update(id, updateCartDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }

  // // Додатковий метод для пошуку кошика за списком товарів
  // async findByProductIds(productIds: number[]): Promise<Cart[]> {
  //   return this.cartRepository.find({ where: { productIds: productIds } });
  // }

  // // Додатковий метод для очищення кошика
  // async clearCart(id: number): Promise<void> {
  //   await this.cartRepository.update(id, { productIds: [], items: [], totalAmount: 0 });
  // }
}