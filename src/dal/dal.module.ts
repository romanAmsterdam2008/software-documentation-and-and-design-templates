import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { TextMessage } from './entities/text-message.entity';
import { AttachmentMessage } from './entities/attachment-message.entity';
import { UserRepository } from './repositories/user.repository';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { CsvReaderService } from './csv/csv-reader.service';
import {
  CHAT_REPOSITORY,
  CSV_READER,
  MESSAGE_REPOSITORY,
  USER_REPOSITORY,
} from '../constants/injection-tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Message, TextMessage, AttachmentMessage]),
  ],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: CHAT_REPOSITORY, useClass: ChatRepository },
    { provide: MESSAGE_REPOSITORY, useClass: MessageRepository },
    { provide: CSV_READER, useClass: CsvReaderService },
  ],
  exports: [USER_REPOSITORY, CHAT_REPOSITORY, MESSAGE_REPOSITORY, CSV_READER],
})
export class DalModule {}
