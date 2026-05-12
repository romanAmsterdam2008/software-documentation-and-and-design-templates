import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column({ type: 'varchar', length: 64 })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable({
    name: 'user_chats',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'chat_id', referencedColumnName: 'chatId' },
  })
  chats!: Chat[];
}
