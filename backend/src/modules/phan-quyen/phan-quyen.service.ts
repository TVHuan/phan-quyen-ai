import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChucNangEntity } from '../chuc-nang/chuc-nang.entity';
import { NguoiDungVaiTroService } from '../nguoi-dung-vai-tro/nguoi-dung-vai-tro.service';
import { VaiTroChucNangService } from '../vai-tro-chuc-nang/vai-tro-chuc-nang.service';
import { PhanHeEntity } from '../phan-he/phan-he.entity';
import { VaiTroEntity } from '../vai-tro/vai-tro.entity';

@Injectable()
export class PhanQuyenService {
  constructor(
    private readonly nguoiDungVaiTroService: NguoiDungVaiTroService,
    private readonly vaiTroChucNangService: VaiTroChucNangService,
    @InjectRepository(ChucNangEntity)
    private readonly chucNangRepository: Repository<ChucNangEntity>,
    @InjectRepository(PhanHeEntity)
    private readonly phanHeRepository: Repository<PhanHeEntity>,
    @InjectRepository(VaiTroEntity)
    private readonly vaiTroRepository: Repository<VaiTroEntity>,
  ) {}

  async getPermissions(
    nguoiDungId: string,
    phanHeId?: string,
  ): Promise<{ scopes: string[]; rsname: string }[]> {
    const systems = phanHeId
      ? await this.phanHeRepository.find({ where: { id: phanHeId } })
      : await this.phanHeRepository.find({ where: { trangThai: true } });

    const result: { scopes: string[]; rsname: string }[] = [];

    for (const system of systems) {
      const vaiTroIds =
        await this.nguoiDungVaiTroService.getVaiTroIdsByNguoiDung(
          nguoiDungId,
          system.id,
        );

      if (!vaiTroIds.length) {
        result.push({ scopes: [], rsname: system.ma });
        continue;
      }

      const chucNangIds =
        await this.vaiTroChucNangService.getChucNangIdsByVaiTroIds(vaiTroIds);

      const chucNangList = chucNangIds.length
        ? await this.chucNangRepository.find({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            where: chucNangIds.map((id) => ({ id }) as any),
          })
        : [];

      result.push({
        scopes: chucNangList.map((cn) => cn.ma),
        rsname: system.ma,
      });
    }

    return result;
  }

  async getPermissionsByRoleCode(
    roleMa: string,
    phanHeMa?: string,
  ): Promise<{ scopes: string[]; rsname: string }[]> {
    const phanHeWhere: any = { trangThai: true };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (phanHeMa) phanHeWhere.ma = phanHeMa;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const systems = await this.phanHeRepository.find({ where: phanHeWhere });
    const result: { scopes: string[]; rsname: string }[] = [];

    for (const system of systems) {
      const vaiTro = await this.vaiTroRepository.findOne({
        where: { ma: roleMa, phanHeId: system.id },
      });

      if (!vaiTro) {
        result.push({ scopes: [], rsname: system.ma });
        continue;
      }

      const chucNangIds =
        await this.vaiTroChucNangService.getChucNangIdsByVaiTroIds([vaiTro.id]);

      const chucNangList = chucNangIds.length
        ? await this.chucNangRepository.find({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            where: chucNangIds.map((id) => ({ id }) as any),
          })
        : [];

      result.push({
        scopes: chucNangList.map((cn) => cn.ma),
        rsname: system.ma,
      });
    }

    return result;
  }
}
