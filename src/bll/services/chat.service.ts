import { Inject, Injectable } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  MESSAGE_REPOSITORY,
} from '../../constants/injection-tokens';
import type { IChatRepository } from '../../dal/interfaces/chat.repository.interface';
import type { IMessageRepository } from '../../dal/interfaces/message.repository.interface';
import type { IChatService } from '../interfaces/chat.service.interface';
import { ChatModel } from '../models';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chats: IChatRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: IMessageRepository,
  ) {}

  async create(data: Partial<ChatModel>): Promise<ChatModel> {
    const created = await this.chats.create(data);
    return Object.assign(new ChatModel(), created);
  }

  async getById(chatId: string): Promise<ChatModel | null> {
    const c = await this.chats.findById(chatId);
    return c ? Object.assign(new ChatModel(), c) : null;
  }

  async getAll(): Promise<ChatModel[]> {
    const list = await this.chats.findAll();
    return list.map((c) => Object.assign(new ChatModel(), c));
  }

  findAll(): Promise<ChatModel[]> {
    return this.getAll();
  }

  findById(chatId: string): Promise<ChatModel | null> {
    return this.getById(chatId);
  }

  async countMessagesByChat(): Promise<Record<string, number>> {
    const chats = await this.chats.findAll();
    const counts: Record<string, number> = {};
    for (const c of chats) {
      const list = await this.messages.findByChat(c.chatId);
      counts[c.chatId] = list.length;
    }
    return counts;
  }
}
