import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID замовлення' })
  orderId: number;

  @ApiProperty({ example: 5, description: 'ID товару' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Кількість товару' })
  quantity: number;

  @ApiProperty({ example: 199.99, description: 'Ціна товару на момент замовлення' })
  price: number;
}