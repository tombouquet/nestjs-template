import { Injectable, NotImplementedException } from '@nestjs/common';
import { FileEntity } from '../../entities/file.entity';
import { FileResponseDto } from './dto/file-response.dto';

@Injectable()
export class UnimplementedFileService {
  private readonly message =
    'Files module is not implemented in production yet.';

  private unimplemented(): never {
    throw new NotImplementedException(this.message);
  }

  uploadFile(
    _file: Buffer,
    _originalName: string,
    _mimeType: string,
    _size: number,
    _folder?: string,
  ): Promise<FileResponseDto> {
    void _file;
    void _originalName;
    void _mimeType;
    void _size;
    void _folder;
    return this.unimplemented();
  }

  getFile(_id: string): Promise<FileResponseDto> {
    void _id;
    return this.unimplemented();
  }

  downloadFile(_id: string): Promise<{ buffer: Buffer; file: FileEntity }> {
    void _id;
    return this.unimplemented();
  }

  deleteFile(_id: string): Promise<void> {
    void _id;
    return this.unimplemented();
  }

  getSignedUrl(_id: string, _expiresIn?: number): Promise<string> {
    void _id;
    void _expiresIn;
    return this.unimplemented();
  }

  listFiles(): Promise<FileResponseDto[]> {
    return this.unimplemented();
  }
}
