import { ChildEntity, Column } from 'typeorm';
import { Message } from './message.entity';
import { MessageType } from './enums';

@ChildEntity(MessageType.TEXT)
export class TextMessage extends Message {
  @Column({ type: 'text', nullable: true })
  text?: string;
}
