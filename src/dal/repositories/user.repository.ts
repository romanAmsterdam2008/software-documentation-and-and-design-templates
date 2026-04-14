import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(data: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  findById(userId: string): Promise<User | null> {
    return this.repo.findOne({ where: { userId } });
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  count(): Promise<number> {
    return this.repo.count();
  }
}
