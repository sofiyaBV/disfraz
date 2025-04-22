import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger('AuthGuard');

  constructor(private jwtService: JwtService) {}

  private readonly publicRoutes = [
    { method: 'POST', path: '/auth/signin' },
    { method: 'POST', path: '/auth/register' },

    { method: 'GET', path: '/products' },
    { method: 'POST', path: '/products' },
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.isPublicRoute(request)) {
      this.logger.log(`Публічний маршрут: ${request.method} ${request.path}`);
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    this.logger.log(
      `Authorization Header: ${request.headers.authorization || 'NONE'}`,
    );

    if (!token) {
      this.logger.warn('Missing token');
      throw new UnauthorizedException('Token is not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      this.logger.log(`JWT Розшифровано: ${JSON.stringify(payload)}`);
      request['user'] = payload;
    } catch (error) {
      const jwtError = error as JsonWebTokenError;
      this.logger.error(`JWT verification error: ${jwtError.message}`);
      throw new UnauthorizedException('Token verification error');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRoute(request: Request): boolean {
    return this.publicRoutes.some(
      (route) =>
        route.method === request.method && request.path.startsWith(route.path),
    );
  }
}
