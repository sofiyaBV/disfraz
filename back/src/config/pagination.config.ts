import { PaginateConfig } from 'nestjs-paginate';
import { Product } from '../product/entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Order } from '../order/entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Comment } from '../comments/entities/comment.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity';
import { FilterOperator } from 'nestjs-paginate';

// Конфігурація для Product
export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['id', 'name', 'price'],
  searchableColumns: ['name', 'description'],
  filterableColumns: {
    price: [FilterOperator.GTE, FilterOperator.LTE],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    'attributes.name': [FilterOperator.EQ],
  },
  relations: ['attributes', 'similarProducts'],
  defaultSortBy: [['id', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  select: [
    'id',
    'name',
    'price',
    'description',
    'images',
    'discount',
    'topSale',
    'newPrice',
  ],
  nullSort: 'last',
};

// Конфігурація для Attribute
export const attributePaginateConfig: PaginateConfig<Attribute> = {
  sortableColumns: ['id', 'material', 'size', 'theme'],
  searchableColumns: ['material', 'size', 'theme', 'bodyPart', 'description'],
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    material: [FilterOperator.EQ, FilterOperator.ILIKE],
    size: [FilterOperator.EQ, FilterOperator.ILIKE],
    theme: [FilterOperator.EQ, FilterOperator.ILIKE],
    bodyPart: [FilterOperator.EQ, FilterOperator.ILIKE],
    isSet: [FilterOperator.EQ],
    valueNumber: [FilterOperator.GTE, FilterOperator.LTE],
    'products.id': [FilterOperator.EQ],
  },
  relations: ['products'],
  defaultSortBy: [['id', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  select: [
    'id',
    'material',
    'size',
    'theme',
    'bodyPart',
    'isSet',
    'description',
  ],
  nullSort: 'last',
};

// Конфігурація для Order
export const orderPaginateConfig: PaginateConfig<Order> = {
  sortableColumns: [
    'id',
    'createdAt',
    'customerName',
    'customerEmail',
    'status',
    'quantity',
    'price',
  ],
  searchableColumns: [
    'customerName',
    'customerEmail',
    'customerPhone',
    'deliveryAddress',
    'notes',
    'status',
  ],
  filterableColumns: {
    customerName: [FilterOperator.EQ, FilterOperator.ILIKE],
    customerEmail: [FilterOperator.EQ, FilterOperator.ILIKE],
    customerPhone: [FilterOperator.EQ, FilterOperator.ILIKE],
    deliveryMethod: [FilterOperator.EQ],
    status: [FilterOperator.EQ, FilterOperator.ILIKE],
    createdAt: [FilterOperator.GTE, FilterOperator.LTE],
    'user.id': [FilterOperator.EQ],
    quantity: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
    price: [FilterOperator.GTE, FilterOperator.LTE],
  },
  relations: ['user'],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  select: [
    'id',
    'createdAt',
    'customerName',
    'customerEmail',
    'customerPhone',
    'deliveryAddress',
    'deliveryMethod',
    'notes',
    'status',
    'quantity',
    'price',
    'productAttributeIds',
  ],
  nullSort: 'last',
};

// Конфігурація для Cart
export const cartPaginateConfig: PaginateConfig<Cart> = {
  sortableColumns: ['id', 'addedAt', 'quantity', 'price'],
  searchableColumns: [],
  filterableColumns: {
    quantity: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
    price: [FilterOperator.GTE, FilterOperator.LTE],
    addedAt: [FilterOperator.GTE, FilterOperator.LTE],
    'user.id': [FilterOperator.EQ],
    'productAttribute.id': [FilterOperator.EQ],
    'productAttribute.product.id': [FilterOperator.EQ],
    'productAttribute.attribute.id': [FilterOperator.EQ],
  },
  relations: [
    'productAttribute',
    'productAttribute.product',
    'productAttribute.attribute',
    'user',
  ],
  defaultSortBy: [['addedAt', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  nullSort: 'last',
};

// Конфігурація для Comment
export const commentPaginateConfig: PaginateConfig<Comment> = {
  sortableColumns: ['id', 'createdAt', 'isModerated'],
  searchableColumns: ['content'],
  filterableColumns: {
    isModerated: [FilterOperator.EQ],
    createdAt: [FilterOperator.GTE, FilterOperator.LTE],
    'user.id': [FilterOperator.EQ],
    'productAttribute.id': [FilterOperator.EQ],
    'productAttribute.product.id': [FilterOperator.EQ],
    'productAttribute.attribute.id': [FilterOperator.EQ],
  },
  relations: [
    'productAttribute',
    'productAttribute.product',
    'productAttribute.attribute',
    'user',
  ],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  nullSort: 'last',
};

// Конфігурація для ProductAttribute
export const productAttributePaginateConfig: PaginateConfig<ProductAttribute> =
  {
    sortableColumns: ['id'],
    searchableColumns: [],
    filterableColumns: {
      'product.id': [FilterOperator.EQ],
      'attribute.id': [FilterOperator.EQ],
      inStock: [FilterOperator.EQ],
    },
    relations: ['product', 'attribute', 'carts', 'comments'],
    defaultSortBy: [['id', 'DESC']],
    maxLimit: 100,
    defaultLimit: 10,
    nullSort: 'last',
  };

// Конфігурація для User
export const userPaginateConfig: PaginateConfig<User> = {
  sortableColumns: ['id', 'email', 'createdAt', 'updatedAt'],
  searchableColumns: ['email', 'phone'],
  filterableColumns: {
    email: [FilterOperator.EQ, FilterOperator.ILIKE],
    phone: [FilterOperator.EQ, FilterOperator.ILIKE],
    createdAt: [FilterOperator.GTE, FilterOperator.LTE],
    updatedAt: [FilterOperator.GTE, FilterOperator.LTE],
    roles: [FilterOperator.IN],
  },
  relations: ['carts', 'comments', 'orders'],
  defaultSortBy: [['createdAt', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  select: ['id', 'email', 'phone', 'createdAt', 'updatedAt', 'roles'],
  nullSort: 'last',
};
