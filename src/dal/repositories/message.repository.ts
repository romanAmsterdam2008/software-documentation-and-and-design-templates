import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { TextMessage } from '../entities/text-message.entity';
import { AttachmentMessage } from '../entities/attachment-message.entity';
import { MessageType } from '../entities/enums';
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

  findAll(): Promise<Message[]> {
    return this.base.find({
      relations: { chat: true },
      order: { timestamp: 'DESC' },
      take: 200,
    });
  }

  findById(messageId: string): Promise<Message | null> {
    return this.base.findOne({
      where: { messageId },
      relations: { chat: true },
    });
  }

  findByType(type: MessageType): Promise<Message[]> {
    return this.base.find({
      where: { type },
      relations: { chat: true },
      order: { timestamp: 'DESC' },
      take: 200,
    });
  }

  findByChat(chatId: string): Promise<Message[]> {
    return this.base.find({
      where: { chatId },
      relations: { chat: true },
      order: { timestamp: 'DESC' },
    });
  }

  async update(
    messageId: string,
    data: Partial<Message>,
  ): Promise<Message | null> {
    const existing = await this.base.findOne({ where: { messageId } });
    if (!existing) return null;
    if (existing.type === MessageType.TEXT) {
      await this.textRepo.update({ messageId }, data as Partial<TextMessage>);
    } else {
      await this.attachRepo.update(
        { messageId },
        data as Partial<AttachmentMessage>,
      );
    }
    return this.findById(messageId);
  }

  async delete(messageId: string): Promise<void> {
    await this.base.delete({ messageId });
  }

  count(): Promise<number> {
    return this.base.count();
  }
}
