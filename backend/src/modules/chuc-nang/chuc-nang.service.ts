import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { ChucNangEntity } from './chuc-nang.entity';

export interface TreeNode {
  id: string;
  ma: string;
  ten: string;
  moTa: string;
  thuTu: number;
  trangThai: boolean;
  parentId: string;
  phanHeId: string;
  children: TreeNode[];
}

@Injectable()
export class ChucNangService extends BaseService<ChucNangEntity> {
  constructor(
    @InjectRepository(ChucNangEntity)
    repository: Repository<ChucNangEntity>,
  ) {
    super(repository);
  }

  async getTree(phanHeId: string): Promise<TreeNode[]> {
    const all = await this.repository.find({
      where: { phanHeId, trangThai: true } as any,
      order: { thuTu: 'ASC' as any },
    } as any);

    const buildTree = (parentId: string | null): TreeNode[] => {
      return all
        .filter((item: ChucNangEntity) =>
          parentId === null
            ? item.parentId === null || item.parentId === undefined
            : item.parentId === parentId,
        )
        .map((item: ChucNangEntity) => ({
          id: item.id,
          ma: item.ma,
          ten: item.ten,
          moTa: item.moTa,
          thuTu: item.thuTu,
          trangThai: item.trangThai,
          parentId: item.parentId,
          phanHeId: item.phanHeId,
          children: buildTree(item.id),
        }));
    };

    return buildTree(null);
  }

  async findAllByPhanHe(phanHeId: string): Promise<ChucNangEntity[]> {
    return this.repository.find({
      where: { phanHeId } as any,
      order: { thuTu: 'ASC' as any },
      relations: { parent: true },
    } as any);
  }
}
