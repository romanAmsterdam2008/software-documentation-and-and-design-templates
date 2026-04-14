import type { Chat } from '../entities/chat.entity';

export interface IChatRepository {
  create(data: Partial<Chat>): Promise<Chat>;
  findById(chatId: string): Promise<Chat | null>;
  findAll(): Promise<Chat[]>;
  count(): Promise<number>;
}
