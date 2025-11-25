import { Request } from 'express';
import { Role } from '../../auth/enums/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}

export interface RequestUser {
  id: number;
  email: string;
  roles: Role[];
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}

export interface AuthInfo {
  message?: string;
  name?: string;
}
