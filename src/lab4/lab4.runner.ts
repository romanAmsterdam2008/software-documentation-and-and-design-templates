import { Logger } from '@nestjs/common';
import { join } from 'path';
import { CsvReader } from './csv-reader';
import { DataProcessor } from './data-processor';
import { ConsoleStrategy } from './strategies/console.strategy';
import { KafkaStrategy } from './strategies/kafka.strategy';
import { RedisStrategy } from './strategies/redis.strategy';
import type { IOutputStrategy } from './interfaces/output-strategy.interface';

function pickStrategy(name: string, logger: Logger): IOutputStrategy {
  switch (name) {
    case 'kafka':
      logger.log('Using Kafka output strategy');
      return new KafkaStrategy();
    case 'redis':
      logger.log('Using Redis output strategy');
      return new RedisStrategy();
    case 'console':
    default:
      logger.log('Using Console output strategy');
      return new ConsoleStrategy();
  }
}

export async function runLab4(): Promise<void> {
  const logger = new Logger('Lab4');
  const strategyName = (process.env.OUTPUT_STRATEGY ?? 'console').toLowerCase();
  const strategy = pickStrategy(strategyName, logger);

  const csvPath = join(process.cwd(), 'data', 'causes-of-death.csv');
  const reader = new CsvReader();

  try {
    const data = await reader.read(csvPath);
    logger.log(`Loaded ${data.length} rows from ${csvPath}`);
    const processor = new DataProcessor(strategy);
    await processor.process(data);
    logger.log('Lab4 processing complete');
  } catch (err) {
    logger.error(`Lab4 failed: ${(err as Error).message}`);
  }
}
