import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto, DeliveryMethod } from './create-order.dto'; // Исправлен импорт DeliveryMethod
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsEnum, IsString } from 'class-validator'; // Добавлен IsString

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
    example: [1, 2, 3],
    description: 'Список ID елементів корзини',
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  override cartIds?: number[];

  @ApiPropertyOptional({
    example: 'Delivered',
    description: 'Статус замовлення',
  })
  @IsString()
  @IsOptional()
  override status?: string;
}
