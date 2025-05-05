import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
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

  @ApiProperty({
    description: 'ID метода оплаты, созданного на клиенте через Stripe.js',
    example: 'pm_card_visa',
  })
  @IsString()
  paymentMethodId: string;
}
