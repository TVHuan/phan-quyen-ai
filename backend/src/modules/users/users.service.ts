import { Injectable } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }
}
