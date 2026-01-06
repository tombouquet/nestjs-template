import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Normalizes email by trimming whitespace and converting to lowercase
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Email validator decorator that validates and normalizes email addresses
 *
 * Usage:
 * ```typescript
 * class UserDto {
 *   @IsEmailNormalized()
 *   email: string;
 * }
 * ```
 */
export function IsEmailNormalized(): PropertyDecorator {
  return function (
    target: Record<string, unknown>,
    propertyKey: string | symbol,
  ) {
    // Apply validation
    IsEmail()(target, propertyKey);

    // Apply transformation for normalization
    Transform(({ value }: { value: unknown }) => {
      if (typeof value === 'string') {
        return normalizeEmail(value);
      }
      return value;
    })(target, propertyKey);
  };
}

/**
 * Email DTO with validation and normalization
 */
export class EmailDto {
  @IsEmailNormalized()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address (will be normalized to lowercase and trimmed)',
  })
  email: string;
}
