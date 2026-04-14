import type { Message } from '../entities/message.entity';
import type { TextMessage } from '../entities/text-message.entity';
import type { AttachmentMessage } from '../entities/attachment-message.entity';
import type { MessageType } from '../entities/enums';

export interface IMessageRepository {
  createText(data: Partial<TextMessage>): Promise<TextMessage>;
  createAttachment(data: Partial<AttachmentMessage>): Promise<AttachmentMessage>;
  findAll(): Promise<Message[]>;
  findById(messageId: string): Promise<Message | null>;
  findByType(type: MessageType): Promise<Message[]>;
  findByChat(chatId: string): Promise<Message[]>;
  update(messageId: string, data: Partial<Message>): Promise<Message | null>;
  delete(messageId: string): Promise<void>;
  count(): Promise<number>;
}
