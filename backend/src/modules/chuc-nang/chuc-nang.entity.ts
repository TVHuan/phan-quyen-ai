import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PhanHeEntity } from '../phan-he/phan-he.entity';

@Entity('chuc_nang')
export class ChucNangEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã chức năng, VD: thinghiem|xem' })
  @Column({ unique: true, length: 200 })
  ma: string;

  @ApiProperty({ description: 'Tên chức năng' })
  @Column({ length: 255 })
  ten: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ nullable: true, type: 'text' })
  moTa: string;

  @ApiProperty({ description: 'Thứ tự hiển thị', default: 0 })
  @Column({ default: 0 })
  thuTu: number;

  @ApiProperty({ description: 'Trạng thái', default: true })
  @Column({ default: true })
  trangThai: boolean;

  @ApiProperty({ description: 'ID phân hệ' })
  @Column({ name: 'phan_he_id' })
  phanHeId: string;

  @ManyToOne(() => PhanHeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phan_he_id' })
  phanHe: PhanHeEntity;

  @ApiProperty({ description: 'ID chức năng cha', required: false })
  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => ChucNangEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: ChucNangEntity;
}
