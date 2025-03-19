import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthUserDto: CreateAuthUserDto): Promise<void> {
    const { email, password, phone } = createAuthUserDto;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует',
      );
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя с ролью user по умолчанию
    const newUser = {
      email,
      password: hashedPassword,
      phone,
      roles: [Role.User], // Всегда устанавливаем роль user
    };

    // Сохраняем пользователя через UserService
    await this.usersService.createUser(newUser);
  }
}
