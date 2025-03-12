import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum DeliveryMethod {
  SelfPickup = 'Самовивіз',
  NovaPoshtaBranch = 'Нова Пошта - відділення',
  NovaPoshtaCourier = 'Нова Пошта - кур’єр',
  UkrPoshtaBranch = 'УкрПошта - відділення',
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Іван Петренко', description: "Ім'я клієнта" })
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email клієнта' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+380971234567', description: 'Телефон клієнта' })
  @IsPhoneNumber('UA')
  customerPhone: string;

  @ApiProperty({
    example: 'вул. Хрещатик, 10, Київ, Україна',
    description: 'Адреса доставки (включая номер отделения, если применимо)',
  })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    example: 'Нова Пошта - відділення',
    description: 'Спосіб доставки',
    enum: DeliveryMethod,
  })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    example: 'Будь ласка, зателефонуйте перед доставкою',
    description: 'Примітки до замовлення',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    example: 'Pending',
    description: 'Статус замовлення',
    default: 'Pending',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
