import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

@Module({
  imports: [
    // Подключение к базе данных PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',        // Используем PostgreSQL
      host: 'localhost',       // Адрес сервера
      port: 5432,              // Порт PostgreSQL
      username: 'postgres',    // Имя пользователя (замени при необходимости)
      password: 'postgres',    // Пароль (замени при необходимости)
      database: 'disfraz',     // Имя базы данных
      autoLoadEntities: true,  // Автоматическая загрузка сущностей
      synchronize: true,       // Автоматическая синхронизация схемы базы данных (только для разработки)
    }),
    TypeOrmModule.forFeature([User]), // Регистрация сущности User
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
