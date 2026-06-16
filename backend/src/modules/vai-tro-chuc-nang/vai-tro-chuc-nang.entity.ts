import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VaiTroEntity } from '../vai-tro/vai-tro.entity';
import { ChucNangEntity } from '../chuc-nang/chuc-nang.entity';

@Entity('vai_tro_chuc_nang')
export class VaiTroChucNangEntity {
  @PrimaryColumn({ name: 'vai_tro_id' })
  vaiTroId: string;

  @ManyToOne(() => VaiTroEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vai_tro_id' })
  vaiTro: VaiTroEntity;

  @PrimaryColumn({ name: 'chuc_nang_id' })
  chucNangId: string;

  @ManyToOne(() => ChucNangEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chuc_nang_id' })
  chucNang: ChucNangEntity;
}
