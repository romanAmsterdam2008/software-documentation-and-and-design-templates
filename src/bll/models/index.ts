import { MessageType } from '../../dal/entities/enums';

export class UserModel {
  userId!: string;
  username!: string;
  email!: string;
  createdAt!: Date;
}

export class ChatModel {
  chatId!: string;
  title!: string;
  createdAt!: Date;
}

export abstract class MessageModel {
  messageId!: string;
  authorId!: string;
  chatId!: string;
  timestamp!: Date;
  type!: MessageType;
  chat?: ChatModel;
}

export class TextMessageModel extends MessageModel {
  override type = MessageType.TEXT;
  text?: string;
}

export class AttachmentMessageModel extends MessageModel {
  override type = MessageType.ATTACHMENT;
  fileUrl?: string;
  fileType?: string;
}
