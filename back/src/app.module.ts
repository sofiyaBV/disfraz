import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      entities: [],            // Добавь сюда пути к сущностям, как только они будут готовы
      synchronize: true,       // Автоматическая синхронизация схемы базы данных (только для разработки)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
