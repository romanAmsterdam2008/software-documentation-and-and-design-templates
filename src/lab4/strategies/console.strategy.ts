import { Logger } from '@nestjs/common';
import type { IOutputStrategy } from '../interfaces/output-strategy.interface';

export class ConsoleStrategy implements IOutputStrategy {
  private readonly logger = new Logger('CausesOfDeath');

  async output(data: Record<string, string>[]): Promise<void> {
    for (const row of data) {
      const year = row['Year'];
      const cause = row['Leading Cause'];
      const sex = row['Sex'];
      const race = row['Race Ethnicity'];
      const deaths = row['Deaths'];
      this.logger.log(
        `${year} | ${cause} | ${sex} | ${race} | deaths=${deaths}`,
      );
    }
  }
}
