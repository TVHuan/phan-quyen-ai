import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('phan_he')
export class PhanHeEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã phân hệ' })
  @Column({ unique: true, length: 100 })
  ma: string;

  @ApiProperty({ description: 'Tên phân hệ' })
  @Column({ length: 255 })
  ten: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ nullable: true, type: 'text' })
  moTa: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', default: true })
  @Column({ default: true })
  trangThai: boolean;
}
