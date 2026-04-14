import type { UserModel } from '../../bll/models';

export interface IUserController {
  list(): Promise<UserModel[]>;
  get(userId: string): Promise<UserModel | null>;
  create(body: Partial<UserModel>): Promise<UserModel>;
}
