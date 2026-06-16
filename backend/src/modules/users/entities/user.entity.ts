import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên đăng nhập' })
  @Column({ unique: true, length: 100 })
  username: string;

  @ApiProperty({ description: 'Mật khẩu đã hash' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'Email', required: false })
  @Column({ nullable: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Họ', required: false })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Tên', required: false })
  @Column({ nullable: true })
  lastName: string;
}
