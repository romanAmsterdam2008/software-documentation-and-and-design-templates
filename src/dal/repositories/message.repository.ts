import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { TextMessage } from '../entities/text-message.entity';
import { AttachmentMessage } from '../entities/attachment-message.entity';
import type { IMessageRepository } from '../interfaces/message.repository.interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(Message) private readonly base: Repository<Message>,
    @InjectRepository(TextMessage) private readonly textRepo: Repository<TextMessage>,
    @InjectRepository(AttachmentMessage)
    private readonly attachRepo: Repository<AttachmentMessage>,
  ) {}

  createText(data: Partial<TextMessage>): Promise<TextMessage> {
    return this.textRepo.save(this.textRepo.create(data));
  }

  createAttachment(data: Partial<AttachmentMessage>): Promise<AttachmentMessage> {
    return this.attachRepo.save(this.attachRepo.create(data));
  }

  findById(messageId: string): Promise<Message | null> {
    return this.base.findOne({ where: { messageId } });
  }

  findByChat(chatId: string): Promise<Message[]> {
    return this.base.find({ where: { chatId } });
  }

  count(): Promise<number> {
    return this.base.count();
  }
}
