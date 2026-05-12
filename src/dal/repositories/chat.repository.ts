import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import type { IChatRepository } from '../interfaces/chat.repository.interface';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectRepository(Chat) private readonly repo: Repository<Chat>,
  ) {}

  create(data: Partial<Chat>): Promise<Chat> {
    return this.repo.save(this.repo.create(data));
  }

  findById(chatId: string): Promise<Chat | null> {
    return this.repo.findOne({ where: { chatId } });
  }

  findAll(): Promise<Chat[]> {
    return this.repo.find();
  }

  count(): Promise<number> {
    return this.repo.count();
  }
}
