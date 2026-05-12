import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../../constants/injection-tokens';
import type { IMessageRepository } from '../../dal/interfaces/message.repository.interface';
import type { IMessageService } from '../interfaces/message.service.interface';
import {
  AttachmentMessageModel,
  ChatModel,
  MessageModel,
  TextMessageModel,
} from '../models';
import { MessageType } from '../../dal/entities/enums';
import type { Message } from '../../dal/entities/message.entity';

function toModel(m: Message): MessageModel {
  const model =
    m.type === MessageType.TEXT
      ? new TextMessageModel()
      : new AttachmentMessageModel();
  Object.assign(model, m);
  if (m.chat) {
    model.chat = Object.assign(new ChatModel(), m.chat);
  }
  return model;
}

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messages: IMessageRepository,
  ) {}

  async createText(data: Partial<TextMessageModel>): Promise<TextMessageModel> {
    const { chat: _chat, ...rest } = data;
    const created = await this.messages.createText(rest);
    return Object.assign(new TextMessageModel(), created);
  }

  async createAttachment(
    data: Partial<AttachmentMessageModel>,
  ): Promise<AttachmentMessageModel> {
    const { chat: _chat, ...rest } = data;
    const created = await this.messages.createAttachment(rest);
    return Object.assign(new AttachmentMessageModel(), created);
  }

  async findAll(): Promise<MessageModel[]> {
    const list = await this.messages.findAll();
    return list.map(toModel);
  }

  async findById(id: string): Promise<MessageModel | null> {
    const m = await this.messages.findById(id);
    return m ? toModel(m) : null;
  }

  async findByType(type: MessageType): Promise<MessageModel[]> {
    const list = await this.messages.findByType(type);
    return list.map(toModel);
  }

  async findByChatId(chatId: string): Promise<MessageModel[]> {
    const list = await this.messages.findByChat(chatId);
    return list.map(toModel);
  }

  async update(
    id: string,
    data: Partial<MessageModel>,
  ): Promise<MessageModel | null> {
    const m = await this.messages.update(id, data as Partial<Message>);
    return m ? toModel(m) : null;
  }

  delete(id: string): Promise<void> {
    return this.messages.delete(id);
  }
}
