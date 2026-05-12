import { Module } from '@nestjs/common';
import { DalModule } from '../dal/dal.module';
import {
  CHAT_SERVICE,
  CSV_SEEDER,
  MESSAGE_SERVICE,
  USER_SERVICE,
} from '../constants/injection-tokens';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { CsvSeederService } from './services/csv-seeder.service';

@Module({
  imports: [DalModule],
  providers: [
    { provide: USER_SERVICE, useClass: UserService },
    { provide: CHAT_SERVICE, useClass: ChatService },
    { provide: MESSAGE_SERVICE, useClass: MessageService },
    { provide: CSV_SEEDER, useClass: CsvSeederService },
  ],
  exports: [USER_SERVICE, CHAT_SERVICE, MESSAGE_SERVICE, CSV_SEEDER],
})
export class BllModule {}
