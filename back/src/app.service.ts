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
      if (this.dataSource.isInitialized) {
        return 'Підключення до бази даних успішно!';
      } else {
        return 'Підключення не ініціалізовано.';
      }
    } catch (error) {
      console.error('Помилка підключення до бази даних:', error);
      return 'Помилка підключення до бази даних.';
    }
  }
}
