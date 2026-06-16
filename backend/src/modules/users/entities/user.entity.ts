import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  picture: string;

  @ApiProperty()
  @Column({ nullable: true })
  googleId: string;
}
