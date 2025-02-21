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
}
