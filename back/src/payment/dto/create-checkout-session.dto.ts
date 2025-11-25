import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'ID замовлення',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({
    description: 'URL для повернення після успішної оплати',
    example: 'http://localhost:3000/payment/success',
    required: false,
  })
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiProperty({
    description: 'URL для повернення при відміні оплати',
    example: 'http://localhost:3000/payment/cancel',
    required: false,
  })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}
