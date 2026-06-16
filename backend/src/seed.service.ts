import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { PhanHeEntity } from './modules/phan-he/phan-he.entity';
import { ChucNangEntity } from './modules/chuc-nang/chuc-nang.entity';
import { VaiTroEntity } from './modules/vai-tro/vai-tro.entity';
import { VaiTroChucNangEntity } from './modules/vai-tro-chuc-nang/vai-tro-chuc-nang.entity';
import { NguoiDungVaiTroEntity } from './modules/nguoi-dung-vai-tro/nguoi-dung-vai-tro.entity';
import { UserEntity } from './modules/users/entities/user.entity';

interface SeedChucNang {
  ma: string;
  ten: string;
  children?: SeedChucNang[];
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(PhanHeEntity)
    private readonly phanHeRepo: Repository<PhanHeEntity>,
    @InjectRepository(ChucNangEntity)
    private readonly chucNangRepo: Repository<ChucNangEntity>,
    @InjectRepository(VaiTroEntity)
    private readonly vaiTroRepo: Repository<VaiTroEntity>,
    @InjectRepository(VaiTroChucNangEntity)
    private readonly vaiTroChucNangRepo: Repository<VaiTroChucNangEntity>,
    @InjectRepository(NguoiDungVaiTroEntity)
    private readonly nguoiDungVaiTroRepo: Repository<NguoiDungVaiTroEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPhanHe();
    await this.seedChucNang();
    await this.seedVaiTro();
    await this.seedAdminUser();
  }

  private async seedPhanHe() {
    const existing = await this.phanHeRepo.findOne({ where: { ma: 'ai-mo-phong' } });
    if (existing) return;

    await this.phanHeRepo.save({
      ma: 'ai-mo-phong',
      ten: 'AI Study Simulator',
      moTa: 'Nền tảng học khoa học tự nhiên qua mô phỏng tương tác + AI giải thích',
      trangThai: true,
    });
    this.logger.log('[Seed] Đã tạo phân hệ ai-mo-phong');
  }

  private async seedChucNang() {
    const phanHe = await this.phanHeRepo.findOne({ where: { ma: 'ai-mo-phong' } });
    if (!phanHe) return;

    const existing = await this.chucNangRepo.findOne({ where: { ma: 'dashboard|xem' } });
    if (existing) return;

    const tree: SeedChucNang[] = [
      { ma: 'dashboard|xem', ten: 'Xem Dashboard' },
      {
        ma: 'quanlythinghiem',
        ten: 'Quản lý thí nghiệm',
        children: [
          { ma: 'quanlythinghiem|xem', ten: 'Xem danh sách thí nghiệm' },
          { ma: 'quanlythinghiem|tao', ten: 'Tạo thí nghiệm mới' },
          { ma: 'quanlythinghiem|sua', ten: 'Sửa thí nghiệm' },
          { ma: 'quanlythinghiem|xoa', ten: 'Xóa thí nghiệm' },
        ],
      },
      {
        ma: 'phancongthinghiem',
        ten: 'Phân công thí nghiệm',
        children: [
          { ma: 'phancongthinghiem|xem', ten: 'Xem phân công' },
          { ma: 'phancongthinghiem|tao', ten: 'Tạo phân công' },
          { ma: 'phancongthinghiem|sua', ten: 'Sửa phân công' },
        ],
      },
      {
        ma: 'quantri',
        ten: 'Quản trị hệ thống',
        children: [
          { ma: 'quantri|xem', ten: 'Xem quản trị' },
          { ma: 'quantri|tao', ten: 'Tạo mới' },
          { ma: 'quantri|xoa', ten: 'Xóa' },
        ],
      },
      {
        ma: 'phanquyen',
        ten: 'Phân quyền',
        children: [
          { ma: 'phanquyen|quanly', ten: 'Quản lý phân quyền' },
          { ma: 'phanquyen|xem', ten: 'Xem phân quyền' },
        ],
      },
    ];

    await this.saveTree(tree, phanHe.id, null);
    this.logger.log('[Seed] Đã tạo cây chức năng');
  }

  private async saveTree(items: SeedChucNang[], phanHeId: string, parentId: string | null) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const payload: any = {
        ma: item.ma,
        ten: item.ten,
        thuTu: i,
        trangThai: true,
        phanHeId,
      };
      if (parentId) payload.parentId = parentId;
      const saved = await this.chucNangRepo.save(payload);
      if (item.children?.length) {
        await this.saveTree(item.children, phanHeId, saved.id);
      }
    }
  }

  private async seedVaiTro() {
    const phanHe = await this.phanHeRepo.findOne({ where: { ma: 'ai-mo-phong' } });
    if (!phanHe) return;

    const existing = await this.vaiTroRepo.findOne({ where: { ma: 'admin' } });
    if (existing) return;

    const allChucNangs = await this.chucNangRepo.find({
      where: { phanHeId: phanHe.id } as any,
    });
    const allChucNangIds = allChucNangs.map((c) => c.id);

    const getChucNangIdsByPrefix = (prefix: string): string[] => {
      return allChucNangs
        .filter((c) => c.ma === prefix || c.ma.startsWith(prefix + '|'))
        .map((c) => c.id);
    };

    const adminGiaoVienIds = [
      ...getChucNangIdsByPrefix('dashboard'),
      ...getChucNangIdsByPrefix('quanlythinghiem'),
      ...getChucNangIdsByPrefix('phancongthinghiem'),
      ...getChucNangIdsByPrefix('quantri'),
      ...getChucNangIdsByPrefix('phanquyen'),
    ];

    const hocSinhIds = [
      ...getChucNangIdsByPrefix('dashboard'),
      ...getChucNangIdsByPrefix('quanlythinghiem|xem'),
    ];

    const admin = await this.vaiTroRepo.save({
      ma: 'admin',
      ten: 'Quản trị viên',
      moTa: 'Toàn quyền trong hệ thống AI Study Simulator',
      macDinh: false,
      trangThai: true,
      phanHeId: phanHe.id,
    });

    const giaoVien = await this.vaiTroRepo.save({
      ma: 'teacher',
      ten: 'Giáo viên',
      moTa: 'Quản lý thí nghiệm, phân công và xem phân quyền',
      macDinh: false,
      trangThai: true,
      phanHeId: phanHe.id,
    });

    const hocSinh = await this.vaiTroRepo.save({
      ma: 'student',
      ten: 'Học sinh',
      moTa: 'Chỉ xem thí nghiệm và dashboard',
      macDinh: true,
      trangThai: true,
      phanHeId: phanHe.id,
    });

    const giaoVienUniqueIds = [...new Set(adminGiaoVienIds)];

    await this.vaiTroChucNangRepo.save(
      allChucNangIds.map((chucNangId) => ({ vaiTroId: admin.id, chucNangId })),
    );

    await this.vaiTroChucNangRepo.save(
      giaoVienUniqueIds.map((chucNangId) => ({ vaiTroId: giaoVien.id, chucNangId })),
    );

    await this.vaiTroChucNangRepo.save(
      hocSinhIds.map((chucNangId) => ({ vaiTroId: hocSinh.id, chucNangId })),
    );

    this.logger.log('[Seed] Đã tạo 3 vai trò: Admin, Giáo viên, Học sinh');
  }

  private async seedAdminUser() {
    const existing = await this.userRepo.findOne({ where: { username: 'admin20k' } });
    if (existing) return;

    const hashedPassword = await bcrypt.hash('abc123', 10);

    const adminUser = await this.userRepo.save({
      username: 'admin20k',
      password: hashedPassword,
      email: 'admin@aisim.io',
      firstName: 'Admin',
      lastName: 'System',
    });

    const phanHe = await this.phanHeRepo.findOne({ where: { ma: 'ai-mo-phong' } });
    const adminRole = await this.vaiTroRepo.findOne({ where: { ma: 'admin' } });

    if (phanHe && adminRole) {
      await this.nguoiDungVaiTroRepo.save({
        nguoiDungId: adminUser.id,
        vaiTroId: adminRole.id,
        phanHeId: phanHe.id,
      });
      this.logger.log('[Seed] Đã tạo tài khoản admin20k / abc123 và gán vai trò Admin');
    }
  }
}
