import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NguoiDungVaiTroEntity } from './nguoi-dung-vai-tro.entity';

@Injectable()
export class NguoiDungVaiTroService {
  constructor(
    @InjectRepository(NguoiDungVaiTroEntity)
    private readonly repository: Repository<NguoiDungVaiTroEntity>,
  ) {}

  async getVaiTroByNguoiDung(nguoiDungId: string, phanHeId?: string): Promise<NguoiDungVaiTroEntity[]> {
    const where: any = { nguoiDungId };
    if (phanHeId) where.phanHeId = phanHeId;
    return this.repository.find({ where, relations: { vaiTro: true, phanHe: true } } as any);
  }

  async getVaiTroIdsByNguoiDung(nguoiDungId: string, phanHeId: string): Promise<string[]> {
    const items = await this.repository.find({
      where: { nguoiDungId, phanHeId } as any,
    });
    return items.map((item) => item.vaiTroId);
  }

  async updateVaiTroForNguoiDung(
    nguoiDungId: string,
    phanHeId: string,
    vaiTroIds: string[],
  ): Promise<void> {
    await this.repository.delete({ nguoiDungId, phanHeId } as any);
    if (vaiTroIds?.length) {
      const entities = vaiTroIds.map((vaiTroId) =>
        this.repository.create({ nguoiDungId, vaiTroId, phanHeId }),
      );
      await this.repository.save(entities);
    }
  }
}
