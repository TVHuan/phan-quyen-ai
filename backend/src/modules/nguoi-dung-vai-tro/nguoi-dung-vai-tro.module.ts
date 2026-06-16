import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NguoiDungVaiTroEntity } from './nguoi-dung-vai-tro.entity';
import { NguoiDungVaiTroService } from './nguoi-dung-vai-tro.service';

@Module({
  imports: [TypeOrmModule.forFeature([NguoiDungVaiTroEntity])],
  providers: [NguoiDungVaiTroService],
  exports: [NguoiDungVaiTroService, TypeOrmModule],
})
export class NguoiDungVaiTroModule {}
