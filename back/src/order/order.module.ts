import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])], // Подключаем модель Order
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], // Для использования в других модулях
})
export class OrderModule {}
