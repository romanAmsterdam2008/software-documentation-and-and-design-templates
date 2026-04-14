import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DalModule } from './dal/dal.module';
import { BllModule } from './bll/bll.module';
import { PlModule } from './pl/pl.module';
import { User } from './dal/entities/user.entity';
import { Chat } from './dal/entities/chat.entity';
import { Message } from './dal/entities/message.entity';
import { TextMessage } from './dal/entities/text-message.entity';
import { AttachmentMessage } from './dal/entities/attachment-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'discord'),
        password: config.get<string>('DB_PASSWORD', 'discord'),
        database: config.get<string>('DB_NAME', 'discord'),
        entities: [User, Chat, Message, TextMessage, AttachmentMessage],
        synchronize: true,
      }),
    }),
    DalModule,
    BllModule,
    PlModule,
  ],
})
export class AppModule {}
