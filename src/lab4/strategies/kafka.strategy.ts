import { Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import type { IOutputStrategy } from '../interfaces/output-strategy.interface';

const TOPIC = 'causes-of-death';
const BATCH_SIZE = 200;

export class KafkaStrategy implements IOutputStrategy {
  private readonly logger = new Logger(KafkaStrategy.name);
  private readonly kafka: Kafka;
  private producer: Producer | null = null;

  constructor(broker = process.env.KAFKA_BROKER ?? 'localhost:9092') {
    this.kafka = new Kafka({
      clientId: 'lab4-producer',
      brokers: [broker],
      retry: { retries: 3 },
    });
  }

  async output(data: Record<string, string>[]): Promise<void> {
    try {
      this.producer = this.kafka.producer();
      await this.producer.connect();
      this.logger.log(
        `Connected to Kafka, sending ${data.length} rows to topic "${TOPIC}"`,
      );

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await this.producer.send({
          topic: TOPIC,
          messages: batch.map((row) => ({
            key: `${row['Year']}-${row['Leading Cause']}`,
            value: JSON.stringify(row),
          })),
        });
        this.logger.log(
          `Sent batch ${i / BATCH_SIZE + 1} (${batch.length} messages)`,
        );
      }

      this.logger.log('All messages sent');
    } catch (err) {
      this.logger.error(`Kafka error: ${(err as Error).message}`);
    } finally {
      if (this.producer) {
        try {
          await this.producer.disconnect();
        } catch {
          /* ignore */
        }
      }
    }
  }
}
