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

    this.logger.log(`Заголовок авторизації: ${authHeader || 'Відсутній'}`);

    if (!authHeader) {
      this.logger.error('Заголовок авторизації не знайдений');
      throw new UnauthorizedException('Токен не знайдений');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      this.logger.warn(
        `Помилка автентифікації JWT: ${info?.message || 'Невідома помилка'}`,
      );
      throw new UnauthorizedException('Недійсний або прострочений токен');
    }

    request.user = user; // ✅ Явно встановлюємо користувача в request
    this.logger.log(
      `Автентифікований користувач JWT: ${user.username} з ролями: ${user.roles}`,
    );

    return user;
  }
}
