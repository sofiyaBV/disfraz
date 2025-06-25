import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { userPaginateConfig } from '../config/pagination.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    const { email, password } = createAdminDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [Role.Admin],
    });

    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, phone } = createUserDto;

    if (email) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new UnauthorizedException('Користувач з таким email вже існує');
      }
    }

    if (phone) {
      const existingUserByPhone = await this.userRepository.findOne({
        where: { phone },
      });
      if (existingUserByPhone) {
        throw new UnauthorizedException(
          'Користувач з таким номером телефону вже існує',
        );
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email: email || null,
      phone: phone || null,
      password: hashedPassword || '', // Порожній пароль для Google
      roles: [Role.User],
    });

    return this.userRepository.save(user);
  }

  async findByEmailOrPhone(
    email?: string,
    phone?: string,
  ): Promise<User | null> {
    if (!email && !phone) {
      throw new UnauthorizedException('Email or phone must be provided');
    }

    const where = [];
    if (email) {
      where.push({ email });
    }
    if (phone) {
      where.push({ phone });
    }

    return this.userRepository.findOne({ where });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Користувач з ID ${id} не знайдено`);
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Користувач з ID ${id} не знайдено`);
    }

    await this.userRepository.delete(id);
  }

  async findAllPag(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate<User>(query, this.userRepository, userPaginateConfig);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    return this.userRepository.findOneBy({ email });
  }

  async findByPhone(phone: string): Promise<User | null> {
    if (!phone) {
      return null;
    }
    return this.userRepository.findOneBy({ phone });
  }
  // Добавьте эти методы в ваш UserService

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
