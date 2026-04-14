import { ChildEntity, Column } from 'typeorm';
import { Message } from './message.entity';
import { MessageType } from './enums';

@ChildEntity(MessageType.ATTACHMENT)
export class AttachmentMessage extends Message {
  @Column({ type: 'varchar', length: 512, nullable: true })
  fileUrl?: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  fileType?: string;
}
