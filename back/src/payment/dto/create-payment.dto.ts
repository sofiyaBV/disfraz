import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Валюта платежу',
    example: 'UAH',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Опис платежу',
    example: 'Сплата замовлення #12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID методу оплати, створеного на клієнті через Stripe.js',
    example: 'pm_card_visa',
  })
  @IsString()
  paymentMethodId: string;
}
