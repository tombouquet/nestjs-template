import { SetMetadata } from '@nestjs/common';

export const AccessTokenRoles = (roles: string[], rule: 'AND' | 'OR' = 'AND') =>
  SetMetadata('accessTokenRoles', { roles, rule });
