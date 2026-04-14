import type { User } from '../entities/user.entity';

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  count(): Promise<number>;
}
