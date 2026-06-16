import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanHeEntity } from './phan-he.entity';
import { PhanHeService } from './phan-he.service';
import { PhanHeController } from './phan-he.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PhanHeEntity])],
  controllers: [PhanHeController],
  providers: [PhanHeService],
  exports: [PhanHeService, TypeOrmModule],
})
export class PhanHeModule {}
