import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ description: 'ID duy nhất của bản ghi' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật cuối' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Ngày xóa mềm' })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
