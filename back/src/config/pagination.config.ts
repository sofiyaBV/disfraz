import { PaginateConfig } from 'nestjs-paginate';
import { Product } from '../product/entities/product.entity';
import { FilterOperator } from 'nestjs-paginate';

export const productPaginateConfig: PaginateConfig<Product> = {
  // Указываем, какие столбцы можно сортировать
  sortableColumns: ['id', 'name', 'price'],

  // Указываем, какие столбцы можно искать
  searchableColumns: ['name', 'description'],

  // Указываем, какие столбцы можно фильтровать и с какими операторами
  filterableColumns: {
    price: [FilterOperator.GTE, FilterOperator.LTE], // Фильтрация по цене: больше или равно, меньше или равно
    name: [FilterOperator.EQ, FilterOperator.ILIKE], // Фильтрация по имени: точное совпадение или частичное (нечувствительное к регистру)
  },

  // Указываем, какие отношения загружать (например, attributes)
  relations: ['attributes'],

  // Устанавливаем сортировку по умолчанию
  defaultSortBy: [['id', 'DESC']],

  // Устанавливаем максимальное количество записей на страницу
  maxLimit: 100,

  // Устанавливаем лимит по умолчанию
  defaultLimit: 10,
};
