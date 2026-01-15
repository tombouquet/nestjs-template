import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { AccessTokenEntity } from '../../entities/access-token.entity';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(AccessTokenEntity)
    private readonly accessTokenRepository: Repository<AccessTokenEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new ForbiddenException(
        'A valid Bearer token must be provided in the Authorization header',
      );
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    // First check: MASTER_ACCESS_TOKEN always valid
    if (token === process.env.MASTER_ACCESS_TOKEN) {
      return true;
    }

    // Look up token in database
    const accessToken = await this.accessTokenRepository.findOne({
      where: { token },
    });

    if (!accessToken) {
      throw new ForbiddenException(
        'A valid Bearer token must be provided in the Authorization header',
      );
    }

    // Validate token is active
    if (!accessToken.active) {
      throw new ForbiddenException('The provided access token is not active');
    }

    // Validate token is not expired
    if (accessToken.expiresAt && accessToken.expiresAt < new Date()) {
      throw new ForbiddenException('The provided access token has expired');
    }

    // Get role requirements from decorator metadata
    const handler = context.getHandler();

    // Check method-level metadata first, then class-level
    // Note: reflector.get returns undefined when no metadata exists, despite the typing
    const metadata = this.reflector.get<
      { roles: string[]; rule: 'AND' | 'OR' } | undefined
    >('accessTokenRoles', handler);

    // If no metadata is present, allow access (no role requirements)
    if (!metadata) {
      request['accessToken'] = accessToken;
      return true;
    }

    // Validate token has required roles
    // Use defensive coding for roles in case of database inconsistency
    const tokenRoles = (accessToken.roles as string[] | null) ?? [];
    const requiredRoles = metadata.roles;

    // Empty roles array means no requirements, so access should be allowed
    if (requiredRoles.length === 0) {
      request['accessToken'] = accessToken;
      return true;
    }

    if (metadata.rule === 'AND') {
      // Token must have ALL specified roles
      const hasAllRoles = requiredRoles.every((role) =>
        tokenRoles.includes(role),
      );
      if (!hasAllRoles) {
        throw new ForbiddenException(
          `Access token must have all of the following roles: ${requiredRoles.join(', ')}`,
        );
      }
    } else {
      // Token must have AT LEAST ONE specified role
      const hasAnyRole = requiredRoles.some((role) =>
        tokenRoles.includes(role),
      );
      if (!hasAnyRole) {
        throw new ForbiddenException(
          `Access token must have at least one of the following roles: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // Attach token entity to request for use in controllers
    request['accessToken'] = accessToken;

    return true;
  }
}
