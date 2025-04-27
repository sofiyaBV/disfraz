import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID платежа от Stripe (stripePaymentIntentId)',
    example: 'pi_1J2K3L4M5N6O7P8Q',
  })
  @IsString()
  stripePaymentIntentId: string;

  @ApiProperty({
    description: 'ID тестового метода оплаты (PaymentMethod) от Stripe',
    example: 'pm_card_visa', // Тестовый PaymentMethod для карты Visa
  })
  @IsString()
  paymentMethodId: string;
}
