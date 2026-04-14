import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../constants/injection-tokens';
import type { IChatRepository } from '../../dal/interfaces/chat.repository.interface';
import type { IChatService } from '../interfaces/chat.service.interface';
import { ChatModel } from '../models';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chats: IChatRepository,
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
}
