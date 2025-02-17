import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Іван Петренко', description: "Ім'я клієнта" })
  Name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email клієнта' })
  Email: string;

  @ApiProperty({ example: '+380971234567', description: 'Телефон клієнта' })
  Phone: string;

  @ApiProperty({
    example: 'вул. Хрещатик, 10, Київ, Україна',
    description: 'Адреса доставки',
  })
  deliveryAddress: string;

  @ApiProperty({
    example: 'Будь ласка, зателефонуйте перед доставкою',
    description: 'Примітки до замовлення',
    required: false,
  })
  notes?: string;

  @ApiProperty({ example: 1, description: 'ID товару' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Кількість товару' })
  quantity: number;

  @ApiProperty({ example: 399.98, description: 'Загальна сума замовлення' })
  totalPrice: number;

  @ApiProperty({
    example: 'Очікує підтвердження',
    description: 'Статус замовлення',
    default: 'Pending',
  })
  status?: string;
}
