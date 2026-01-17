import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Optional custom path/folder for the file',
    example: 'avatars',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}
