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
      username: 'postgres',    // Имя пользователя 
      password: 'postgres',    // Пароль 
      database: 'disfraz',     // Имя базы данных
      autoLoadEntities: true,  // Автоматическая загрузка сущностей
      synchronize: true,       // Автоматическая синхронизация схемы базы данных (только для разработки)
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
