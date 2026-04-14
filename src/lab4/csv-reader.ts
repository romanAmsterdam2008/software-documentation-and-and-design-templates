import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

export class CsvReader {
  read(filePath: string): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
      const rows: Record<string, string>[] = [];
      const source = createReadStream(filePath);
      source.on('error', reject);
      source
        .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
        .on('data', (row: Record<string, string>) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
