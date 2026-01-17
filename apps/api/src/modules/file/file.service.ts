import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FileEntity } from '../../entities/file.entity';
import {
  StorageProvider,
  STORAGE_PROVIDER_TOKEN,
} from './interfaces/storage-provider.interface';
import { FileResponseDto } from './dto/file-response.dto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  /**
   * Uploads a file and stores its metadata
   * @param file The file buffer
   * @param originalName Original filename
   * @param mimeType MIME type of the file
   * @param size File size in bytes
   * @param folder Optional folder/path prefix
   * @returns The created file entity with optional signed URL
   */
  async uploadFile(
    file: Buffer,
    originalName: string,
    mimeType: string,
    size: number,
    folder?: string,
  ): Promise<FileResponseDto> {
    // Generate a unique storage key
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const uniqueId = uuidv4();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const basePath = folder ? `${folder}/${timestamp}` : `uploads/${timestamp}`;
    const storageKey = `${basePath}/${uniqueId}-${sanitizedName}`;

    // Get bucket name from provider if available
    const bucket =
      'getBucket' in this.storageProvider
        ? (this.storageProvider as { getBucket: () => string }).getBucket()
        : process.env.S3_BUCKET || 'local-files';

    // Upload to storage
    await this.storageProvider.upload(file, storageKey, mimeType);

    // Save metadata to database
    const fileEntity = this.fileRepository.create({
      originalName,
      mimeType,
      size,
      storageKey,
      bucket,
    });

    const savedFile = await this.fileRepository.save(fileEntity);

    this.logger.log(
      `File uploaded: ${originalName} -> ${storageKey} (${size} bytes)`,
    );

    return this.toResponseDto(savedFile);
  }

  /**
   * Gets file metadata by ID
   * @param id File ID
   * @returns File metadata with signed URL
   */
  async getFile(id: string): Promise<FileResponseDto> {
    const file = await this.fileRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    const url = await this.storageProvider.getSignedUrl(file.storageKey);

    return this.toResponseDto(file, url);
  }

  /**
   * Downloads file content by ID
   * @param id File ID
   * @returns File buffer and metadata
   */
  async downloadFile(
    id: string,
  ): Promise<{ buffer: Buffer; file: FileEntity }> {
    const file = await this.fileRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    const buffer = await this.storageProvider.download(file.storageKey);

    return { buffer, file };
  }

  /**
   * Deletes a file by ID
   * @param id File ID
   */
  async deleteFile(id: string): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    // Delete from storage
    await this.storageProvider.delete(file.storageKey);

    // Soft delete from database
    await this.fileRepository.softDelete(id);

    this.logger.log(`File deleted: ${file.originalName} (${id})`);
  }

  /**
   * Gets a signed URL for a file
   * @param id File ID
   * @param expiresIn Expiration time in seconds
   * @returns Signed URL
   */
  async getSignedUrl(id: string, expiresIn?: number): Promise<string> {
    const file = await this.fileRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    return this.storageProvider.getSignedUrl(file.storageKey, expiresIn);
  }

  /**
   * Lists all files (non-deleted)
   * @returns Array of file metadata
   */
  async listFiles(): Promise<FileResponseDto[]> {
    const files = await this.fileRepository.find({
      order: { createdAt: 'DESC' },
    });

    return files.map((file) => this.toResponseDto(file));
  }

  /**
   * Converts a FileEntity to FileResponseDto
   */
  private toResponseDto(file: FileEntity, url?: string): FileResponseDto {
    return {
      id: file.id as string,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      storageKey: file.storageKey,
      bucket: file.bucket,
      createdAt: file.createdAt as Date,
      url,
    };
  }
}
