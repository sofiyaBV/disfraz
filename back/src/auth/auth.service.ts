import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string | undefined,
    phone: string | undefined,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
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

  async register(createUserDto: CreateUserDto): Promise<void> {
    const { email, phone, password } = createUserDto;

    // Проверяем, что хотя бы email или phone переданы
    if (!email && !phone) {
      throw new UnauthorizedException('Email or phone must be provided');
    }

    // Проверяем, передан ли email и существует ли пользователь с таким email
    if (email) {
      const existingUserByEmail = await this.usersService.findByEmail(email);
      if (existingUserByEmail) {
        throw new UnauthorizedException('Користувач з таким email вже існує');
      }
    }

    // Проверяем, передан ли phone и существует ли пользователь с таким номером телефона
    if (phone) {
      const existingUserByPhone = await this.usersService.findByPhone(phone);
      if (existingUserByPhone) {
        throw new UnauthorizedException(
          'Користувач з таким номером телефону вже існує',
        );
      }
    }

    const newUser = {
      email,
      password,
      phone,
      roles: [Role.User],
    };

    await this.usersService.createUser(newUser);
  }
}
