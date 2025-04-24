import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID заказа', example: 'order_12345' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Сумма платежа', example: 100.5 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Валюта платежа',
    example: 'UAH',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Описание платежа',
    example: 'Оплата заказа #12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
