import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { PhanHeEntity } from './phan-he.entity';

@Injectable()
export class PhanHeService extends BaseService<PhanHeEntity> {
  constructor(
    @InjectRepository(PhanHeEntity)
    repository: Repository<PhanHeEntity>,
  ) {
    super(repository);
  }
}
