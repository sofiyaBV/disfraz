import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation') // Название API
    .setDescription('API для вашего проекта') // Описание
    .setVersion('1.0') // Версия API
    // .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
