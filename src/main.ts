import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { CSV_SEEDER } from './constants/injection-tokens';
import type { ICsvSeeder } from './bll/interfaces/csv-seeder.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const seeder = app.get<ICsvSeeder>(CSV_SEEDER);
  const csvPath = join(process.cwd(), 'data', 'seed.csv');
  try {
    await seeder.seed(csvPath);
  } catch (err) {
    logger.error('Seeding failed', err as Error);
  }

  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  logger.log(`Listening on http://localhost:${port}`);
}
bootstrap();
