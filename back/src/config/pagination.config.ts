import { PaginateConfig } from 'nestjs-paginate';
import { Product } from '../product/entities/product.entity';
import { FilterOperator } from 'nestjs-paginate';

export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['id', 'name', 'price'],
  searchableColumns: ['name', 'description'],
  filterableColumns: {
    price: [FilterOperator.GTE, FilterOperator.LTE],
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    similarProducts: [FilterOperator.CONTAINS], // Добавляем фильтрацию по массиву
    'attributes.name': [FilterOperator.EQ], // Добавляем фильтрацию по атрибутам
  },
  relations: ['attributes'],
  defaultSortBy: [['id', 'DESC']],
  maxLimit: 100,
  defaultLimit: 10,
  select: ['id', 'name', 'price', 'description', 'similarProducts'], // Ограничиваем возвращаемые поля
  nullSort: 'last', // NULL значения в конце при сортировке
};
