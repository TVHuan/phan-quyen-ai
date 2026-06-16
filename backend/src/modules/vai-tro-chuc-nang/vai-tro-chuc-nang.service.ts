import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VaiTroChucNangEntity } from './vai-tro-chuc-nang.entity';

@Injectable()
export class VaiTroChucNangService {
  constructor(
    @InjectRepository(VaiTroChucNangEntity)
    private readonly repository: Repository<VaiTroChucNangEntity>,
  ) {}

  async getChucNangByVaiTro(vaiTroId: string): Promise<VaiTroChucNangEntity[]> {
    return this.repository.find({
      where: { vaiTroId } as any,
      relations: { chucNang: true },
    } as any);
  }

  async getChucNangIdsByVaiTro(vaiTroId: string): Promise<string[]> {
    const items = await this.repository.find({ where: { vaiTroId } as any });
    return items.map((item) => item.chucNangId);
  }

  async updateChucNangForVaiTro(vaiTroId: string, chucNangIds: string[]): Promise<void> {
    await this.repository.delete({ vaiTroId } as any);
    if (chucNangIds?.length) {
      const entities = chucNangIds.map((chucNangId) =>
        this.repository.create({ vaiTroId, chucNangId }),
      );
      await this.repository.save(entities);
    }
  }

  async getChucNangIdsByVaiTroIds(vaiTroIds: string[]): Promise<string[]> {
    const items = await this.repository.find({
      where: { vaiTroId: In(vaiTroIds) as any } as any,
    });
    return [...new Set(items.map((item) => item.chucNangId))];
  }
}
