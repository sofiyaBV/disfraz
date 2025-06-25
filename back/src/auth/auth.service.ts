import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from './enums/role.enum';
import { User } from '../user/entities/user.entity';

interface UpdateProfileDto {
  email?: string;
  phone?: string;
  password?: string;
}

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

  async register(createUserDto: CreateUserDto): Promise<User> {
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

    return await this.usersService.createUser(createUserDto);
  }

  async updateProfile(
    userId: number,
    updateData: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Користувач не знайдений');
    }

    // Проверяем уникальность email, если он изменяется
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.usersService.findByEmail(
        updateData.email,
      );
      if (existingUser && existingUser.id !== userId) {
        throw new UnauthorizedException('Користувач з таким email вже існує');
      }
    }

    // Проверяем уникальность телефона, если он изменяется
    if (updateData.phone && updateData.phone !== user.phone) {
      const existingUser = await this.usersService.findByPhone(
        updateData.phone,
      );
      if (existingUser && existingUser.id !== userId) {
        throw new UnauthorizedException(
          'Користувач з таким номером телефону вже існує',
        );
      }
    }

    // Хешируем новый пароль, если он предоставлен
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return await this.usersService.updateUser(userId, updateData);
  }

  async findOrCreateGoogleUser(data: {
    email: string;
    googleId: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const { email, googleId, firstName, lastName } = data;

    // Сначала ищем пользователя по email
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Если пользователя нет, создаем нового
      const createUserDto: CreateUserDto = {
        email,
        password: '', // Пароль не нужен для Google OAuth
        phone: null,
        roles: [Role.User],
      };

      user = await this.usersService.createUser(createUserDto);

      await this.usersService.updateUser(user.id, user);
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
