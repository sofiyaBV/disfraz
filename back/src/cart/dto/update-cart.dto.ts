import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ 
    example: [1, 2], 
    description: 'Обновленный список ID товаров, выбранных пользователем в магазине', 
    required: false 
  })
  productIds?: number[];

  @ApiProperty({ 
    example: [
      { productId: 1, quantity: 3, price: 199.99 },
      { productId: 2, quantity: 1, price: 99.99 }
    ], 
    description: 'Обновленные детали товаров в корзине (ID, количество, цена)', 
    required: false 
  })
  items?: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;

  @ApiProperty({ 
    example: 698.96, 
    description: 'Обновленная общая сумма корзины', 
    required: false 
  })
  totalAmount?: number;

  @ApiProperty({ 
    example: '2025-02-28T09:00:00.000Z', 
    description: 'Обновленная дата создания корзины (опционально)', 
    required: false 
  })
  createdAt?: Date;

  @ApiProperty({ 
    example: '2025-02-28T09:05:00.000Z', 
    description: 'Обновленная дата обновления корзины (опционально)', 
    required: false 
  })
  updatedAt?: Date;
}