import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';

async function run() {
  const logger = new Logger('SeedScript');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  logger.log('Seed script finished (auto-seed runs on application bootstrap).');
  await app.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
