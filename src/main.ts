import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const hbs = require('hbs');
import { AppModule } from './app.module';
import { CSV_SEEDER } from './constants/injection-tokens';
import type { ICsvSeeder } from './bll/interfaces/csv-seeder.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  app.setBaseViewsDir(path.join(process.cwd(), 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(path.join(process.cwd(), 'views', 'partials'));
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('shortId', (id: string) => (id ? id.slice(0, 8) : ''));
  hbs.registerHelper('formatDate', (d: string | Date) =>
    d ? new Date(d).toLocaleString() : '',
  );
  hbs.registerHelper('typeBadge', (type: string) =>
    type === 'TEXT' ? 'primary' : 'warning',
  );
  hbs.registerHelper('preview', (text: string, len = 50) =>
    text ? (text.length > len ? text.slice(0, len) + '…' : text) : '',
  );

  const seeder = app.get<ICsvSeeder>(CSV_SEEDER);
  const csvPath = path.join(process.cwd(), 'data', 'seed.csv');
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
