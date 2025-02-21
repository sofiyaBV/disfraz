import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
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
      return true; //  Если у метода нет ограничений по ролям, доступ открыт
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('Request without user - rejected');
      return false;
    }

    this.logger.log(`User ${user.username} role-modelled: ${user.roles}`);

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      this.logger.warn(`Access denied. Required roles: ${requiredRoles}`);
    }

    return hasRole;
  }
}
