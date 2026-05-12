import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import type { IOutputStrategy } from '../interfaces/output-strategy.interface';

export class RedisStrategy implements IOutputStrategy {
  private readonly logger = new Logger(RedisStrategy.name);
  private readonly host: string;
  private readonly port: number;

  constructor(
    host = process.env.REDIS_HOST ?? 'localhost',
    port = parseInt(process.env.REDIS_PORT ?? '6379', 10),
  ) {
    this.host = host;
    this.port = port;
  }

  async output(data: Record<string, string>[]): Promise<void> {
    const client = new Redis({
      host: this.host,
      port: this.port,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });

    try {
      await client.connect();
      this.logger.log(
        `Connected to Redis ${this.host}:${this.port}, writing ${data.length} keys`,
      );

      const pipeline = client.pipeline();
      for (const row of data) {
        const key = `causes-of-death:${row['Year']}:${row['Leading Cause']}:${row['Race Ethnicity']}`;
        const sanitized = Object.fromEntries(
          Object.entries(row).filter(
            ([, v]) => v !== undefined && v !== null && v !== '',
          ),
        );
        if (Object.keys(sanitized).length > 0) {
          pipeline.hset(key, sanitized);
        }
      }
      await pipeline.exec();
      this.logger.log('All hashes written');
    } catch (err) {
      this.logger.error(`Redis error: ${(err as Error).message}`);
    } finally {
      try {
        await client.quit();
      } catch {
        /* ignore */
      }
    }
  }
}
