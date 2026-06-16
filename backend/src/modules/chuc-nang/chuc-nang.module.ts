import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChucNangEntity } from './chuc-nang.entity';
import { ChucNangService } from './chuc-nang.service';
import { ChucNangController } from './chuc-nang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChucNangEntity])],
  controllers: [ChucNangController],
  providers: [ChucNangService],
  exports: [ChucNangService, TypeOrmModule],
})
export class ChucNangModule {}
