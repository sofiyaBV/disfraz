import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4173',
      'http://localhost:4114',
      'http://localhost:5173',
      /^http:\/\/localhost:\d+$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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

  SwaggerModule.setup('doc', app, document, swaggerCustomOptions);

  await app.listen(3000, '0.0.0.0');

  console.log(' Swagger docs available at: http://localhost:3000/doc');
}
bootstrap();
