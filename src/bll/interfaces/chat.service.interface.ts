import type { ChatModel } from '../models';

export interface IChatService {
  create(data: Partial<ChatModel>): Promise<ChatModel>;
  getById(chatId: string): Promise<ChatModel | null>;
  getAll(): Promise<ChatModel[]>;
}
