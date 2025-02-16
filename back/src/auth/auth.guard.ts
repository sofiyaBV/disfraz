import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // Список публичных маршрутов, где не требуется авторизация
  private readonly publicRoutes = [
    { method: 'POST', path: '/auth/signin' },
    { method: 'POST', path: '/user' },
    { method: 'GET', path: '/user' },
    { method: 'GET', path: '/products' },
    { method: 'POST', path: '/products' },
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Проверяем, является ли маршрут публичным
    if (this.isPublicRoute(request)) {
      console.log(`Public route accessed: ${request.method} ${request.url}`);
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    console.log('Authorization Header:', request.headers.authorization);
    console.log('Extracted Token:', token);

    if (!token) {
      console.log('No token found, throwing UnauthorizedException');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      console.log('Decoded JWT Payload:', payload);
      request['user'] = payload;
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRoute(request: Request): boolean {
    return this.publicRoutes.some(
      (route) => route.method === request.method && request.url.startsWith(route.path),
    );
  }
}
