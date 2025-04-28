import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
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
