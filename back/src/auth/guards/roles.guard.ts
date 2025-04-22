import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger('RolesGuard');

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Якщо у метода немає обмежень за ролями, доступ відкритий
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      //  Перевіряємо, чи є взагалі ролі
      this.logger.warn('Запит без користувача або ролей - відхилено');
      return false;
    }

    this.logger.log(`Користувач ${user.username} з ролями: ${user.roles}`);

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      this.logger.warn(`Доступ заборонений. Потрібні ролі: ${requiredRoles}`);
    }

    return hasRole;
  }
}
