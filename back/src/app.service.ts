import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseConnection(): Promise<string> {
    try {
      await this.dataSource.initialize(); // Инициализируем подключение
      return 'Подключение к базе данных успешно!';
    } catch (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return 'Ошибка подключения к базе данных.';
    }
  }
}
