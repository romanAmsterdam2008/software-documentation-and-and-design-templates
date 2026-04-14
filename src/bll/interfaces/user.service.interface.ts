import type { UserModel } from '../models';

export interface IUserService {
  create(data: Partial<UserModel>): Promise<UserModel>;
  getById(userId: string): Promise<UserModel | null>;
  getAll(): Promise<UserModel[]>;
}
