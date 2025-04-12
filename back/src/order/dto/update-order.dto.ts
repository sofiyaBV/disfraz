import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { DeliveryMethod } from './create-order.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: 'Іван Петренко',
    description: "Ім'я клієнта",
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({
    example: 'ivan@example.com',
    description: 'Електронна пошта клієнта',
  })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({
    example: '+380971234567',
    description: 'Телефон клієнта',
  })
  @IsPhoneNumber('UA')
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional({
    example: 'вул. Хрещатик, 10, Київ, Україна',
    description: 'Адреса доставки',
  })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    example: 'Нова Пошта - відділення',
    description: 'Спосіб доставки',
    enum: DeliveryMethod,
  })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({
    example: 'Будь ласка, зателефонуйте перед доставкою',
    description: 'Примітки до замовлення',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: 'Pending',
    description: 'Статус замовлення',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
