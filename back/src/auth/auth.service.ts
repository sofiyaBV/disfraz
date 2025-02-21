import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username, roles: user.roles }; // ✅ Теперь в токене есть roles
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
