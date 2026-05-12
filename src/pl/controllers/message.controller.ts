import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CHAT_SERVICE,
  MESSAGE_SERVICE,
  USER_SERVICE,
} from '../../constants/injection-tokens';
import type { IMessageService } from '../../bll/interfaces/message.service.interface';
import type { IChatService } from '../../bll/interfaces/chat.service.interface';
import type { IUserService } from '../../bll/interfaces/user.service.interface';
import { MessageType } from '../../dal/entities/enums';

interface CreateMessageBody {
  type: string;
  chatId: string;
  authorId: string;
  text?: string;
  fileUrl?: string;
  fileType?: string;
}

interface UpdateMessageBody {
  text?: string;
  fileUrl?: string;
  fileType?: string;
}

@Controller()
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private readonly messages: IMessageService,
    @Inject(CHAT_SERVICE) private readonly chats: IChatService,
    @Inject(USER_SERVICE) private readonly users: IUserService,
  ) {}

  @Get('/')
  @Redirect('/messages')
  root() {
    return;
  }

  @Get('/messages')
  @Render('messages/index')
  async list(@Query('type') type?: string) {
    const filter =
      type === MessageType.TEXT || type === MessageType.ATTACHMENT
        ? (type as MessageType)
        : undefined;
    const messages = filter
      ? await this.messages.findByType(filter)
      : await this.messages.findAll();
    return { messages, currentType: filter ?? '' };
  }

  @Get('/messages/new')
  @Render('messages/create')
  async newForm() {
    const [chats, users] = await Promise.all([
      this.chats.findAll(),
      this.users.getAll(),
    ]);
    return { chats, users };
  }

  @Get('/messages/:id')
  @Render('messages/show')
  async show(@Param('id') id: string) {
    const message = await this.messages.findById(id);
    return { message };
  }

  @Get('/messages/:id/edit')
  @Render('messages/edit')
  async editForm(@Param('id') id: string) {
    const message = await this.messages.findById(id);
    return { message };
  }

  @Post('/messages')
  async create(@Body() body: CreateMessageBody, @Res() res: Response) {
    if (body.type === MessageType.TEXT) {
      await this.messages.createText({
        authorId: body.authorId,
        chatId: body.chatId,
        text: body.text ?? undefined,
      });
    } else {
      await this.messages.createAttachment({
        authorId: body.authorId,
        chatId: body.chatId,
        fileUrl: body.fileUrl ?? undefined,
        fileType: body.fileType ?? undefined,
      });
    }
    res.redirect('/messages');
  }

  @Post('/messages/:id/update')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMessageBody,
    @Res() res: Response,
  ) {
    await this.messages.update(id, {
      ...(body.text !== undefined ? { text: body.text } : {}),
      ...(body.fileUrl !== undefined ? { fileUrl: body.fileUrl } : {}),
      ...(body.fileType !== undefined ? { fileType: body.fileType } : {}),
    } as never);
    res.redirect(`/messages/${id}`);
  }

  @Post('/messages/:id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.messages.delete(id);
    res.redirect('/messages');
  }
}
