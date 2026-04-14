import { Module } from '@nestjs/common';
import { BllModule } from '../bll/bll.module';
import { MessageController } from './controllers/message.controller';
import { ChatController } from './controllers/chat.controller';

@Module({
  imports: [BllModule],
  controllers: [MessageController, ChatController],
})
export class PlModule {}
