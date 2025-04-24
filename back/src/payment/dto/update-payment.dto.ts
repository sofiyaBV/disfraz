import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Статус платежа',
    example: 'success',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'ID платежа от LiqPay',
    example: 'pay_987654',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentId?: string;
}
