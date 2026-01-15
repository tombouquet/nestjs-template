import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @ApiProperty({
    example: '0d237300-7123-42dc-92c8-c2bcc57d394e',
    readOnly: true,
    required: false,
  })
  @IsOptional()
  id?: string;

  @CreateDateColumn()
  @IsOptional()
  @ApiProperty({
    readOnly: true,
    description: 'Created at date',
    required: false,
  })
  createdAt?: Date;

  @UpdateDateColumn()
  @IsOptional()
  @ApiProperty({
    readOnly: true,
    description: 'Updated at date',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Whether or not this object has been deleted',
    readOnly: true,
    required: false,
    default: false,
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}
