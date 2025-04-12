import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload); //  Перевіряємо, що всередині токена
    const user = await this.usersService.findOne(payload.sub);
    console.log('User from DB:', user); // Перевіряємо, що user знайдений

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
