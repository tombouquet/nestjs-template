import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import {
  StorageProvider,
  STORAGE_PROVIDER_TOKEN,
} from './interfaces/storage-provider.interface';
import { LocalS3Provider } from './providers/local-s3.provider';

/**
 * File module for uploading, storing, and managing files
 *
 * Uses the LocalS3Provider by default, which connects to MinIO or any S3-compatible storage.
 * You can create custom storage providers by implementing the StorageProvider interface
 * and updating this module to use them.
 */
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [
    FileService,
    LocalS3Provider,
    {
      provide: STORAGE_PROVIDER_TOKEN,
      useFactory: (localS3Provider: LocalS3Provider): StorageProvider => {
        // You can change the provider here by:
        // 1. Direct swap: return a different provider instance
        // 2. Environment-based: use process.env.STORAGE_PROVIDER to select

        const providerType = process.env.STORAGE_PROVIDER || 'local-s3';

        switch (providerType) {
          case 'local-s3':
          default:
            return localS3Provider;
          // Add more cases here when you create additional providers:
          // case 'aws-s3':
          //   return awsS3Provider;
          // case 'gcs':
          //   return gcsProvider;
          // case 'azure-blob':
          //   return azureBlobProvider;
        }
      },
      inject: [LocalS3Provider],
    },
  ],
  exports: [FileService],
})
export class FileModule {}
