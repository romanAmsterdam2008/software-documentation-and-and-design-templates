export interface ICsvSeeder {
  seed(filePath: string): Promise<void>;
}
