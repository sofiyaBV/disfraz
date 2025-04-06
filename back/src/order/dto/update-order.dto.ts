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
  @ApiPropertyOptional({ example: 'Иван Петренко', description: 'Имя клиента' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({
    example: 'ivan@example.com',
    description: 'Email клиента',
  })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({
    example: '+380971234567',
    description: 'Телефон клиента',
  })
  @IsPhoneNumber('UA')
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional({
    example: 'ул. Хрещатик, 10, Киев, Украина',
    description: 'Адрес доставки',
  })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    example: 'Новая Почта - отделение',
    description: 'Способ доставки',
    enum: DeliveryMethod,
  })
  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod;

  @ApiPropertyOptional({
    example: 'Пожалуйста, позвоните перед доставкой',
    description: 'Заметки к заказу',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: 'Pending',
    description: 'Статус заказа',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
