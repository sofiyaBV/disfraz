import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  RequestUser,
  AuthInfo,
} from '../../common/interfaces/request.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public route - bypassing JWT check');
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = RequestUser>(
    err: Error | null,
    user: TUser | false,
    info: AuthInfo | undefined,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      this.logger.warn(`JWT auth failed: ${info?.message || 'Unknown error'}`);
      throw err || new UnauthorizedException('Invalid or expired token');
    }

    const requestUser = user as RequestUser;
    this.logger.debug(`User authenticated: ${requestUser.id}`);
    return user;
  }
}
