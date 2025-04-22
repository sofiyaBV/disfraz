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
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
  });

  dotenv.config();
  // Конфігурація Swagger
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Документація API для роботи з користувачами')
    .setVersion('1.0')
    .addBearerAuth() // JWT підтримка
    .build();

  // Додаткові налаштування Swagger
  const documentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
    autoTagControllers: true,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  // Кастомні налаштування UI Swagger
  const swaggerCustomOptions = {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    explorer: true, // Вмикаємо перемикач версій API
    customCss: '.topbar { background-color: #4CAF50 }',
    customSiteTitle: 'User API Docs',
  };

  SwaggerModule.setup('doc', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();

// Адреси документації:
// Swagger UI: http://localhost:3000/doc
// JSON: http://localhost:3000/swagger/json
// YAML: http://localhost:3000/swagger/yaml
