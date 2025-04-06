import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { User } from './user/entities/user.entity';
import { AttributesModule } from './attribute/attribute.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { CartModule } from './cart/cart.module';
import { CommentsModule } from './comments/comments.module';
import { PaymentModule } from './payment/payment.module';

import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Подключаем database.config.ts
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'), // Используем всю конфигурацию из databaseConfig
      }),
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    OrderModule,
    ProductModule,
    AttributesModule,
    ProductAttributeModule,
    CartModule,
    CommentsModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
