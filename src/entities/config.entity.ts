import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
@Index(['key'], { unique: true })
export class ConfigEntity<T extends string> extends BaseEntity {
  @ApiProperty({
    description: 'Unique configuration key identifier',
    example: 'APP_NAME',
    required: true,
  })
  @Column({
    type: 'text',
  })
  key: T;

  @ApiProperty({
    description: 'Configuration value associated with the key',
    example: 'NestJS Template',
    required: true,
  })
  @Column()
  @IsString()
  value: string;
}
