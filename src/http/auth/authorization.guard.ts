import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret, GetVerificationKey } from 'jwks-rsa';
import { Reflector } from '@nestjs/core';
import { PERMISSION_SCOPES, Role, ROLES_KEY } from 'src/util/constants';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const httpContext = context.switchToHttp();

    // const req = httpContext.getRequest();
    // const res = httpContext.getResponse();

    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJWT = promisify(
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(req, res);
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const scopeRules = req?.auth.permissions as string[];
      if (requiredRoles) {
        if (!scopeRules?.length) return false;

        const [requiredRole] = requiredRoles;

        const hasAccess = scopeRules.every((scopeType) =>
          PERMISSION_SCOPES[requiredRole].includes(scopeType),
        );

        return hasAccess;
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
