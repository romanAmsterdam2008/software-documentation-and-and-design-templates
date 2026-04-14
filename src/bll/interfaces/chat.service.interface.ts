import type { ChatModel } from '../models';

export interface IChatService {
  create(data: Partial<ChatModel>): Promise<ChatModel>;
  getById(chatId: string): Promise<ChatModel | null>;
  getAll(): Promise<ChatModel[]>;
  findAll(): Promise<ChatModel[]>;
  findById(chatId: string): Promise<ChatModel | null>;
  countMessagesByChat(): Promise<Record<string, number>>;
}
