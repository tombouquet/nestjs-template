import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProvider } from '../interfaces/storage-provider.interface';

/**
 * Local S3 provider - uses MinIO or any S3-compatible storage
 * Designed for local development but works with any S3-compatible service
 */
@Injectable()
export class LocalS3Provider implements StorageProvider, OnModuleInit {
  private readonly logger = new Logger(LocalS3Provider.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'local-files';

    this.s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  /**
   * Ensures the bucket exists, creates it if it doesn't
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket "${this.bucket}" exists`);
    } catch (error) {
      const errorCode = (error as { Code?: string }).Code;
      const errorName = (error as { name?: string }).name;

      if (errorName === 'NotFound' || errorCode === 'NotFound') {
        try {
          this.logger.log(`Creating bucket "${this.bucket}"...`);
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucket }),
          );
          this.logger.log(`Bucket "${this.bucket}" created successfully`);
        } catch (createError) {
          const createErrorCode = (createError as { Code?: string }).Code;
          // Bucket was created by another process, that's fine
          if (
            createErrorCode === 'BucketAlreadyOwnedByYou' ||
            createErrorCode === 'BucketAlreadyExists'
          ) {
            this.logger.log(`Bucket "${this.bucket}" already exists`);
          } else {
            throw createError;
          }
        }
      } else {
        this.logger.error(`Error checking bucket: ${(error as Error).message}`);
        throw error;
      }
    }
  }

  /**
   * Uploads a file to S3/MinIO
   */
  async upload(file: Buffer, key: string, mimeType: string): Promise<void> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
        }),
      );
      this.logger.log(`File uploaded successfully: ${key}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload file ${key}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Downloads a file from S3/MinIO
   */
  async download(key: string): Promise<Buffer> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        throw new Error(`File not found: ${key}`);
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
      }

      this.logger.log(`File downloaded successfully: ${key}`);
      return Buffer.concat(chunks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to download file ${key}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Deletes a file from S3/MinIO
   */
  async delete(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete file ${key}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Generates a signed URL for temporary file access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      this.logger.log(`Signed URL generated for: ${key}`);
      return url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to generate signed URL for ${key}: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Returns the bucket name for this provider
   */
  getBucket(): string {
    return this.bucket;
  }
}
