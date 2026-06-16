import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChucNangEntity } from '../chuc-nang/chuc-nang.entity';
import { PhanHeEntity } from '../phan-he/phan-he.entity';
import { VaiTroEntity } from '../vai-tro/vai-tro.entity';
import { NguoiDungVaiTroModule } from '../nguoi-dung-vai-tro/nguoi-dung-vai-tro.module';
import { VaiTroChucNangModule } from '../vai-tro-chuc-nang/vai-tro-chuc-nang.module';
import { PhanQuyenService } from './phan-quyen.service';
import { PhanQuyenController } from './phan-quyen.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChucNangEntity, PhanHeEntity, VaiTroEntity]),
    NguoiDungVaiTroModule,
    VaiTroChucNangModule,
  ],
  controllers: [PhanQuyenController],
  providers: [PhanQuyenService],
  exports: [PhanQuyenService],
})
export class PhanQuyenModule {}
