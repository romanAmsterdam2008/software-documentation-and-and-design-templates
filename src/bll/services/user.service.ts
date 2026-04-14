import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../constants/injection-tokens';
import type { IUserRepository } from '../../dal/interfaces/user.repository.interface';
import type { IUserService } from '../interfaces/user.service.interface';
import { UserModel } from '../models';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) {}

  async create(data: Partial<UserModel>): Promise<UserModel> {
    const created = await this.users.create(data);
    return Object.assign(new UserModel(), created);
  }

  async getById(userId: string): Promise<UserModel | null> {
    const u = await this.users.findById(userId);
    return u ? Object.assign(new UserModel(), u) : null;
  }

  async getAll(): Promise<UserModel[]> {
    const list = await this.users.findAll();
    return list.map((u) => Object.assign(new UserModel(), u));
  }
}
