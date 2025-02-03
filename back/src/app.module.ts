import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
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
  TypeOrmModule.forFeature([User]), // Регистрация сущности User
  User,
  AuthModule, // Подключаем модуль аутентификации
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
