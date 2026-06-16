import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { VaiTroEntity } from './vai-tro.entity';

@Injectable()
export class VaiTroService extends BaseService<VaiTroEntity> {
  constructor(
    @InjectRepository(VaiTroEntity)
    repository: Repository<VaiTroEntity>,
  ) {
    super(repository);
  }

  async findAllByPhanHe(phanHeId: string): Promise<VaiTroEntity[]> {
    return this.repository.find({
      where: { phanHeId } as any,
      order: { ma: 'ASC' },
    });
  }
}
