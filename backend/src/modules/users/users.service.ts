import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
      select: { id: true, username: true, password: true, email: true, firstName: true, lastName: true, createdAt: true, updatedAt: true },
    });
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id } as any,
      select: { id: true, username: true, email: true, firstName: true, lastName: true, createdAt: true, updatedAt: true },
    } as any);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }
}
