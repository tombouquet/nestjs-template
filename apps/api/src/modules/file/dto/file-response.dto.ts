import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the file',
    example: '0d237300-7123-42dc-92c8-c2bcc57d394e',
  })
  id: string;

  @ApiProperty({
    description: 'Original filename as uploaded',
    example: 'document.pdf',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: 'Storage key/path in the storage backend',
    example: 'uploads/2024/01/abc123-document.pdf',
  })
  storageKey: string;

  @ApiProperty({
    description: 'Storage bucket name',
    example: 'local-files',
  })
  bucket: string;

  @ApiProperty({
    description: 'Created at date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Signed URL for temporary access (when requested)',
    example: 'https://storage.example.com/file?signature=...',
  })
  url?: string;
}
