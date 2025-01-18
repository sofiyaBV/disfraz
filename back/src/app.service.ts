import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseConnection(): Promise<string> {
    try {
      // Проверяем, инициализирован ли DataSource
      if (this.dataSource.isInitialized) {
        return 'Подключение к базе данных успешно!';
      } else {
        return 'Подключение не инициализировано.';
      }
    } catch (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return 'Ошибка подключения к базе данных.';
    }
  }
}
