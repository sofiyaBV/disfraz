import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Валідація
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Удаляет поля, которых нет в DTO
  //     forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
  //     transform: true, // Преобразует входные данные в типы, указанные в DTO
  //   }),
  // );

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
  });

  dotenv.config();
  // Конфігурація Swagger
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Документация API для работы с пользователями')
    .setVersion('1.0')
    .addBearerAuth() // JWT підтримка
    .build();

  // Дополнительные настройки Swagger
  const documentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
    autoTagControllers: true,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  // Кастомные настройки UI Swagger
  const swaggerCustomOptions = {
    jsonDocumentUrl: 'swagger/json', // JSON-документация по /swagger/json
    yamlDocumentUrl: 'swagger/yaml', // YAML-документация по /swagger/yaml
    explorer: true, // Включаем переключатель версий API
    customCss: '.topbar { background-color: #4CAF50 }', // Меняем цвет заголовка
    customSiteTitle: 'User API Docs', // Кастомное название страницы
  };

  // Відкриваємо Swagger UI за `/api`
  SwaggerModule.setup('doc', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();

// Адреси документації:
// Swagger UI: http://localhost:3000/doc
// JSON: http://localhost:3000/swagger/json
// YAML: http://localhost:3000/swagger/yaml
