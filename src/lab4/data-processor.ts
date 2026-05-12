import type { IOutputStrategy } from './interfaces/output-strategy.interface';

export class DataProcessor {
  constructor(private readonly strategy: IOutputStrategy) {}

  process(data: Record<string, string>[]): Promise<void> {
    return this.strategy.output(data);
  }
}
