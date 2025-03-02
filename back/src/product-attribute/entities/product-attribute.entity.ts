import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('product_attribute')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор зв’язку

  @ManyToOne(() => Product, (product) => product.attributes)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Attribute, (attribute) => attribute.products)
  @JoinColumn({ name: 'attributeId' })
  attribute: Attribute;

  @OneToMany(() => Cart, (cart) => cart.productAttribute)
  carts: Cart[]; // Связь с корзиной (многие продукты/атрибуты могут быть в разных корзинах)
}