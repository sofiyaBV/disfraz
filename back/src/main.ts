import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4114'], // Дозволяємо запити з Swagger та фронтенду
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Дозволені методи
    allowedHeaders: ['Content-Type', 'Authorization'], // Дозволені заголовки
    credentials: true, // Дозволяємо передачу cookies 
  });

  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Документація API для роботи з користувачами')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
    autoTagControllers: true,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);

  const swaggerCustomOptions = {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    explorer: true,
    customCss: '.topbar { background-color: #4CAF50 }',
    customSiteTitle: 'User API Docs',
  };

  app.useGlobalPipes(new ValidationPipe());

  SwaggerModule.setup('doc', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
