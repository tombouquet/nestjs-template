import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '0d237300-7123-42dc-92c8-c2bcc57d394e',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User roles',
    type: [String],
    enum: UserRole,
    isArray: true,
    example: ['admin'],
  })
  roles: UserRole[];

  @ApiProperty({
    description: 'Created at date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at date',
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
