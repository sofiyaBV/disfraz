import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Валидация переменных окружения с разрешением неизвестных ключей
  const envVarsSchema = Joi.object({
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().port().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
  });

  const { error, value } = envVarsSchema.validate(process.env, { 
    abortEarly: false, 
    allowUnknown: true // Разрешаем неизвестные ключи
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  // Возвращаем конфигурацию для TypeORM
  return {
    type: 'postgres',
    host: value.POSTGRES_HOST,
    port: parseInt(value.POSTGRES_PORT, 10) || 5432,
    username: value.POSTGRES_USER,
    password: value.POSTGRES_PASSWORD,
    database: value.POSTGRES_DB,
    autoLoadEntities: true,
    synchronize: true,
  };
});