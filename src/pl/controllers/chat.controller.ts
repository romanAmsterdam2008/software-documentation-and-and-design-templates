import { Controller, Get, Inject, Render } from '@nestjs/common';
import { CHAT_SERVICE } from '../../constants/injection-tokens';
import type { IChatService } from '../../bll/interfaces/chat.service.interface';

@Controller('chats')
export class ChatController {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chats: IChatService,
  ) {}

  @Get()
  @Render('chats/index')
  async list() {
    const [chats, counts] = await Promise.all([
      this.chats.findAll(),
      this.chats.countMessagesByChat(),
    ]);
    const rows = chats.map((c) => ({ ...c, messageCount: counts[c.chatId] ?? 0 }));
    return { chats: rows };
  }
}
