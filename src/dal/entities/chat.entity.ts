import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chatId!: string;

  @Column({ type: 'varchar', length: 128 })
  title!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => User, (user) => user.chats)
  users!: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[];
}
