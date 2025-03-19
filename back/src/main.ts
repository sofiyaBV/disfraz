import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Включаем валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Преобразует входные данные в типы, указанные в DTO
    }),
  );
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
  });
  dotenv.config();
  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Документация API для работы с пользователями')
    .setVersion('1.0')
    .addBearerAuth() // JWT поддержка
    .build();

  // Дополнительные настройки Swagger
  const documentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey, // Убираем `Controller_` из названий операций
    autoTagControllers: true, // Использует название контроллера в качестве тега
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

  // Открываем Swagger UI по `/api`
  SwaggerModule.setup('doc', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();

// Адреса документации:
// Swagger UI: http://localhost:3000/doc
// JSON: http://localhost:3000/swagger/json
// YAML: http://localhost:3000/swagger/yaml
