import type { ChatModel } from '../../bll/models';

export interface IChatController {
  list(): Promise<ChatModel[]>;
  get(chatId: string): Promise<ChatModel | null>;
  create(body: Partial<ChatModel>): Promise<ChatModel>;
}
