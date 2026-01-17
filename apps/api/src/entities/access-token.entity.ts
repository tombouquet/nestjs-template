import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
@Index(['token'], { unique: true })
export class AccessTokenEntity extends BaseEntity {
  @ApiProperty({
    example: '0d237300-7123-42dc-92c8-c2bcc57d394e',
    description: 'The API key/token value',
  })
  @Column({ unique: true })
  token: string;

  @ApiProperty({
    description: 'Array of role strings assigned to this token',
    type: [String],
  })
  @Column({ type: 'jsonb', default: () => "'[]'" })
  roles: string[];

  @ApiProperty({
    description: 'Human-readable name for the token',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Optional description',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Whether the token is currently active',
    default: true,
  })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    description: 'Optional expiration date',
    required: false,
  })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}
