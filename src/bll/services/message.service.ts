import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../../constants/injection-tokens';
import type { IMessageRepository } from '../../dal/interfaces/message.repository.interface';
import type { IMessageService } from '../interfaces/message.service.interface';
import {
  AttachmentMessageModel,
  MessageModel,
  TextMessageModel,
} from '../models';
import { MessageType } from '../../dal/entities/enums';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messages: IMessageRepository,
  ) {}

  async createText(data: Partial<TextMessageModel>): Promise<TextMessageModel> {
    const created = await this.messages.createText(data);
    return Object.assign(new TextMessageModel(), created);
  }

  async createAttachment(
    data: Partial<AttachmentMessageModel>,
  ): Promise<AttachmentMessageModel> {
    const created = await this.messages.createAttachment(data);
    return Object.assign(new AttachmentMessageModel(), created);
  }

  async getByChat(chatId: string): Promise<MessageModel[]> {
    const list = await this.messages.findByChat(chatId);
    return list.map((m) => {
      const model =
        m.type === MessageType.TEXT
          ? new TextMessageModel()
          : new AttachmentMessageModel();
      return Object.assign(model, m);
    });
  }
}
