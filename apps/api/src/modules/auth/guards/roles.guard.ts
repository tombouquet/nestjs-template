import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();

    const metadata = this.reflector.get<
      { roles: UserRole[]; rule: 'AND' | 'OR' } | undefined
    >('roles', handler);

    // If no metadata is present, allow access (no role requirements)
    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: UserEntity }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const requiredRoles = metadata.roles;

    // Empty roles array means no requirements, so access should be allowed
    if (requiredRoles.length === 0) {
      return true;
    }

    // Use defensive coding for roles in case of database inconsistency
    const userRoles = (user.roles as UserRole[] | null) ?? [];

    if (metadata.rule === 'AND') {
      // User must have ALL specified roles
      const hasAllRoles = requiredRoles.every((role) =>
        userRoles.includes(role),
      );
      if (!hasAllRoles) {
        throw new ForbiddenException(
          `User must have all of the following roles: ${requiredRoles.join(', ')}`,
        );
      }
    } else {
      // User must have AT LEAST ONE specified role
      const hasAnyRole = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasAnyRole) {
        throw new ForbiddenException(
          `User must have at least one of the following roles: ${requiredRoles.join(', ')}`,
        );
      }
    }

    return true;
  }
}
