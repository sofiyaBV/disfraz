import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description:
      'ID замовлення для оплати (optional - якщо не вказано, використовується останнє неоплачене замовлення користувача)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  orderId?: number;

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
