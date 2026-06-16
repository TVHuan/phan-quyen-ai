import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PhanHeEntity } from '../phan-he/phan-he.entity';

@Entity('vai_tro')
export class VaiTroEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã vai trò' })
  @Column({ unique: true, length: 100 })
  ma: string;

  @ApiProperty({ description: 'Tên vai trò' })
  @Column({ length: 255 })
  ten: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ nullable: true, type: 'text' })
  moTa: string;

  @ApiProperty({ description: 'Vai trò mặc định', default: false })
  @Column({ default: false })
  macDinh: boolean;

  @ApiProperty({ description: 'Trạng thái', default: true })
  @Column({ default: true })
  trangThai: boolean;

  @ApiProperty({ description: 'ID phân hệ' })
  @Column({ name: 'phan_he_id' })
  phanHeId: string;

  @ManyToOne(() => PhanHeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phan_he_id' })
  phanHe: PhanHeEntity;
}
