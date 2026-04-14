import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  CSV_READER,
  MESSAGE_REPOSITORY,
  USER_REPOSITORY,
} from '../../constants/injection-tokens';
import type { ICsvReader } from '../../dal/interfaces/csv-reader.interface';
import type { IUserRepository } from '../../dal/interfaces/user.repository.interface';
import type { IChatRepository } from '../../dal/interfaces/chat.repository.interface';
import type { IMessageRepository } from '../../dal/interfaces/message.repository.interface';
import type { ICsvSeeder } from '../interfaces/csv-seeder.interface';

@Injectable()
export class CsvSeederService implements ICsvSeeder {
  private readonly logger = new Logger(CsvSeederService.name);

  constructor(
    @Inject(CSV_READER) private readonly csv: ICsvReader,
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(CHAT_REPOSITORY) private readonly chats: IChatRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: IMessageRepository,
  ) {}

  async seed(filePath: string): Promise<void> {
    if ((await this.users.count()) > 0) {
      this.logger.log('Database already seeded, skipping');
      return;
    }

    const rows = await this.csv.read(filePath);
    this.logger.log(`Loaded ${rows.length} rows from ${filePath}`);

    const userRows = rows.filter((r) => r.type === 'USER');
    const chatRows = rows.filter((r) => r.type === 'CHAT');
    const textRows = rows.filter((r) => r.type === 'TEXT_MESSAGE');
    const attachRows = rows.filter((r) => r.type === 'ATTACHMENT_MESSAGE');

    for (const r of userRows) {
      await this.users.create({
        userId: r.id,
        username: r.username,
        email: r.email,
      });
    }
    this.logger.log(`Inserted ${userRows.length} users`);

    for (const r of chatRows) {
      await this.chats.create({ chatId: r.id, title: r.chatTitle });
    }
    this.logger.log(`Inserted ${chatRows.length} chats`);

    for (const r of textRows) {
      await this.messages.createText({
        messageId: r.messageId,
        authorId: r.authorId,
        chatId: r.chatRef,
        text: r.text ?? undefined,
      });
    }
    this.logger.log(`Inserted ${textRows.length} text messages`);

    for (const r of attachRows) {
      await this.messages.createAttachment({
        messageId: r.messageId,
        authorId: r.authorId,
        chatId: r.chatRef,
        fileUrl: r.fileUrl ?? undefined,
        fileType: r.fileType ?? undefined,
      });
    }
    this.logger.log(`Inserted ${attachRows.length} attachment messages`);
  }
}
