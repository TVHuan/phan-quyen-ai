import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaiTroChucNangEntity } from './vai-tro-chuc-nang.entity';
import { VaiTroChucNangService } from './vai-tro-chuc-nang.service';

@Module({
  imports: [TypeOrmModule.forFeature([VaiTroChucNangEntity])],
  providers: [VaiTroChucNangService],
  exports: [VaiTroChucNangService, TypeOrmModule],
})
export class VaiTroChucNangModule {}
