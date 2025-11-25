import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import {
  JwtPayload,
  RequestUser,
} from '../common/interfaces/request.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: JwtStrategy.extractJwtFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  private static extractJwtFromCookieOrHeader(req: Request): string | null {
    let token = null;

    if (req && req.cookies && req.cookies['access_token']) {
      token = req.cookies['access_token'];
    }

    if (!token) {
      token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    }

    return token;
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
