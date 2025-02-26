import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Іван Петренко', description: "Ім'я клієнта" })
  customerName: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email клієнта' })
  customerEmail: string;

  @ApiProperty({ example: '+380971234567', description: 'Телефон клієнта' })
  customerPhone: string;

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

  @ApiProperty({
    example: 'Очікує підтвердження',
    description: 'Статус замовлення',
    default: 'Pending',
  })
  status?: string;
}