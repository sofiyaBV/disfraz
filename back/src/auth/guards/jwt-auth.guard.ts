import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log(`Authorization Header: ${authHeader || 'NONE'}`);

    if (!authHeader) {
      this.logger.error('No Authorization Header found');
      throw new UnauthorizedException('Token is not found');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      this.logger.warn(`JWT Authentication failed: ${info?.message || 'Unknown error'}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = user; // ✅ Явно устанавливаем пользователя в request
    this.logger.log(`JWT Authenticated user: ${user.username} with roles: ${user.roles}`);

    return user;
  }
}
