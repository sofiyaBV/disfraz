import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID платежа вiд Stripe (stripePaymentIntentId)',
    example: 'pi_1J2K3L4M5N6O7P8Q',
  })
  @IsString()
  stripePaymentIntentId: string;
}
