import type {
  AttachmentMessageModel,
  MessageModel,
  TextMessageModel,
} from '../models';

export interface IMessageService {
  createText(data: Partial<TextMessageModel>): Promise<TextMessageModel>;
  createAttachment(
    data: Partial<AttachmentMessageModel>,
  ): Promise<AttachmentMessageModel>;
  getByChat(chatId: string): Promise<MessageModel[]>;
}
