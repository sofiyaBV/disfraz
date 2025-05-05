import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class HandleCallbackDto {
  @ApiProperty({
    description: 'ID платежа вiд Stripe (PaymentIntent ID)',
    example: 'pi_1J2K3L4M5N6O7P8Q',
  })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}
