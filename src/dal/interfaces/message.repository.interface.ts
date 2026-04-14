import type { Message } from '../entities/message.entity';
import type { TextMessage } from '../entities/text-message.entity';
import type { AttachmentMessage } from '../entities/attachment-message.entity';

export interface IMessageRepository {
  createText(data: Partial<TextMessage>): Promise<TextMessage>;
  createAttachment(data: Partial<AttachmentMessage>): Promise<AttachmentMessage>;
  findById(messageId: string): Promise<Message | null>;
  findByChat(chatId: string): Promise<Message[]>;
  count(): Promise<number>;
}
