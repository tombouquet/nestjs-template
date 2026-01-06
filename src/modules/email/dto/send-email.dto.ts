import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Normalizes email by trimming whitespace and converting to lowercase
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * DTO for sending emails
 */
export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return normalizeEmail(value);
    }
    return value;
  })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Recipient email address',
  })
  to: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Welcome to our service',
    description: 'Email subject',
  })
  subject: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'This is a plain text email body',
    description: 'Plain text email body',
  })
  text?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '<h1>This is an HTML email body</h1>',
    description: 'HTML email body',
  })
  html?: string;
}
