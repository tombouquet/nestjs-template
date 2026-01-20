import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { TemplateName } from '../templates';

/**
 * Normalizes email by trimming whitespace and converting to lowercase
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * DTO for testing template-based emails
 */
export class TestTemplateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return normalizeEmail(value);
    }
    return value;
  })
  @ApiProperty({
    example: 'test@example.com',
    description: 'Recipient email address',
  })
  to: string;

  @IsEnum(['welcome', 'password-reset'])
  @IsNotEmpty()
  @ApiProperty({
    example: 'welcome',
    description: 'Template name to use',
    enum: ['welcome', 'password-reset'],
  })
  templateName: TemplateName;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Test Email',
    description: 'Email subject',
  })
  subject: string;

  // Welcome template props
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Name for welcome template',
  })
  name?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return normalizeEmail(value);
    }
    return value;
  })
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email for welcome template',
  })
  email?: string;

  // Password reset template props
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'https://example.com/reset-password?token=abc123',
    description: 'Reset link for password-reset template',
  })
  resetLink?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '1 hour',
    description: 'Expiration time for password-reset template',
  })
  expiresIn?: string;
}
