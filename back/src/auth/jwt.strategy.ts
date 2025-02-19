import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { // ✅ Явно указываем 'jwt'
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test', // ✅ Указали ключ явно
    });
  }

  async validate(payload: any) {
    return this.usersService.findOne(payload.sub); // ✅ Возвращаем пользователя по ID
  }
}
