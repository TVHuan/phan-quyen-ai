import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaiTroEntity } from './vai-tro.entity';
import { VaiTroService } from './vai-tro.service';
import { VaiTroController } from './vai-tro.controller';
import { VaiTroChucNangModule } from '../vai-tro-chuc-nang/vai-tro-chuc-nang.module';

@Module({
  imports: [TypeOrmModule.forFeature([VaiTroEntity]), VaiTroChucNangModule],
  controllers: [VaiTroController],
  providers: [VaiTroService],
  exports: [VaiTroService, TypeOrmModule],
})
export class VaiTroModule {}
