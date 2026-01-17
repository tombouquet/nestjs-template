import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
@Index(['storageKey'], { unique: true })
export class FileEntity extends BaseEntity {
  @ApiProperty({
    description: 'Original filename as uploaded',
    example: 'document.pdf',
  })
  @Column()
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @Column()
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024,
  })
  @Column({ type: 'bigint' })
  size: number;

  @ApiProperty({
    description: 'Unique storage key/path in the storage backend',
    example: 'uploads/2024/01/abc123-document.pdf',
  })
  @Column({ unique: true })
  storageKey: string;

  @ApiProperty({
    description: 'Storage bucket name',
    example: 'my-bucket',
  })
  @Column()
  bucket: string;
}
