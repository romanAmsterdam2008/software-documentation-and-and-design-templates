import type {
  AttachmentMessageModel,
  MessageModel,
  TextMessageModel,
} from '../models';
import type { MessageType } from '../../dal/entities/enums';

export interface IMessageService {
  createText(data: Partial<TextMessageModel>): Promise<TextMessageModel>;
  createAttachment(
    data: Partial<AttachmentMessageModel>,
  ): Promise<AttachmentMessageModel>;
  findAll(): Promise<MessageModel[]>;
  findById(id: string): Promise<MessageModel | null>;
  findByType(type: MessageType): Promise<MessageModel[]>;
  findByChatId(chatId: string): Promise<MessageModel[]>;
  update(id: string, data: Partial<MessageModel>): Promise<MessageModel | null>;
  delete(id: string): Promise<void>;
}
