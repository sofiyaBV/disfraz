import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from './enums/role.enum';
import { User } from '../user/entities/user.entity';

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

    if (!email && !phone) {
      throw new UnauthorizedException('Email or phone must be provided');
    }

    if (email) {
      const existingUserByEmail = await this.usersService.findByEmail(email);
      if (existingUserByEmail) {
        throw new UnauthorizedException('Користувач з таким email вже існує');
      }
    }

    if (phone) {
      const existingUserByPhone = await this.usersService.findByPhone(phone);
      if (existingUserByPhone) {
        throw new UnauthorizedException(
          'Користувач з таким номером телефону вже існує',
        );
      }
    }

    await this.usersService.createUser(createUserDto);
  }

  async findOrCreateGoogleUser(data: {
    email: string;
    googleId: string;
  }): Promise<User> {
    const { email, googleId } = data;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      const createUserDto: CreateUserDto = {
        email,
        password: '', // Пароль не потрібен для Google
        phone: null,
        roles: [Role.User], // Автоматично присвоюємо роль User
      };
      user = await this.usersService.createUser(createUserDto);
    }

    return user;
  }

  async generateJwtToken(payload: {
    sub: number;
    email: string;
    roles: Role[];
  }): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
