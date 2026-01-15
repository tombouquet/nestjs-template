import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { UserRole } from '../modules/auth/enums/user-role.enum';

@Entity()
@Index(['email'], { unique: true })
export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'Array of role strings assigned to this user',
    type: [String],
    enum: UserRole,
    isArray: true,
    default: [],
  })
  @Column({ type: 'jsonb', default: () => "'[]'" })
  roles: UserRole[];
}
