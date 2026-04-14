import type {
  AttachmentMessageModel,
  MessageModel,
  TextMessageModel,
} from '../../bll/models';

export interface IMessageController {
  listByChat(chatId: string): Promise<MessageModel[]>;
  createText(body: Partial<TextMessageModel>): Promise<TextMessageModel>;
  createAttachment(
    body: Partial<AttachmentMessageModel>,
  ): Promise<AttachmentMessageModel>;
}
