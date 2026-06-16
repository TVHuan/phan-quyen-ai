import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { VaiTroEntity } from '../vai-tro/vai-tro.entity';
import { PhanHeEntity } from '../phan-he/phan-he.entity';

@Entity('nguoi_dung_vai_tro')
export class NguoiDungVaiTroEntity {
  @PrimaryColumn({ name: 'nguoi_dung_id' })
  nguoiDungId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nguoi_dung_id' })
  nguoiDung: UserEntity;

  @PrimaryColumn({ name: 'vai_tro_id' })
  vaiTroId: string;

  @ManyToOne(() => VaiTroEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vai_tro_id' })
  vaiTro: VaiTroEntity;

  @PrimaryColumn({ name: 'phan_he_id' })
  phanHeId: string;

  @ManyToOne(() => PhanHeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phan_he_id' })
  phanHe: PhanHeEntity;
}
