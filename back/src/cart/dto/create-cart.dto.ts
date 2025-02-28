import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'Список ID товаров, выбранных пользователем в магазине' 
  })
  productIds: number[];

  @ApiProperty({ 
    example: [
      { productId: 1, quantity: 2, price: 199.99 },
      { productId: 2, quantity: 1, price: 99.99 },
      { productId: 3, quantity: 1, price: 299.99 }
    ], 
    description: 'Детали товаров в корзине (ID, количество, цена)' 
  })
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;

  @ApiProperty({ 
    example: 798.97, 
    description: 'Общая сумма корзины' 
  })
  totalAmount: number;

  @ApiProperty({ 
    example: '2025-02-28T08:58:55.000Z', 
    description: 'Дата создания корзины (автоматически генерируется)', 
    required: false 
  })
  createdAt?: Date;

  @ApiProperty({ 
    example: '2025-02-28T09:00:00.000Z', 
    description: 'Дата обновления корзины (автоматически генерируется, опционально)', 
    required: false 
  })
  updatedAt?: Date;
}