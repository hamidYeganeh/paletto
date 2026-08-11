import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  logger.log(`Paletto API listening on http://localhost:${port}/api/v1`);
}

bootstrap();
