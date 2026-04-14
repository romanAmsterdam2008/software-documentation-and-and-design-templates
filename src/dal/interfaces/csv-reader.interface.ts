export interface CsvRow {
  [key: string]: string;
}

export interface ICsvReader {
  read(filePath: string): Promise<CsvRow[]>;
}
