import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOne(phoneNumber: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ phone_number: phoneNumber });
  }

  async findOneByRefreshToken(token: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ refresh_token: token });
  }

  async updateRefreshToken(userId: number, token: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (user) {
      user.refresh_token = token;
    }
    return this.userRepo.save(user);
    // return user;
  }

  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async update(user: User) {
    this.userRepo.update(user.id, user);
  }
}
