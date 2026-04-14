import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageType } from './enums';

@Entity('messages')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  messageId!: string;

  @Column({ type: 'uuid' })
  authorId!: string;

  @CreateDateColumn()
  timestamp!: Date;

  type!: MessageType;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: Chat;

  @Column({ type: 'uuid', name: 'chat_id' })
  chatId!: string;
}
