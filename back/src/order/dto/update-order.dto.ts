import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto, DeliveryMethod } from './create-order.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({
    example: 'Нова Пошта - кур’єр',
    description: 'Спосіб доставки',
    enum: DeliveryMethod,
  })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  override deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({
    example: 'Delivered',
    description: 'Статус замовлення',
  })
  @IsString()
  @IsOptional()
  override status?: string;
}
