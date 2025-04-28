import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, User])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
