import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAdmin(CreateAdminDto: CreateAdminDto): Promise<User> {
    const { email, password } = CreateAdminDto;

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя с ролью admin
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [Role.Admin], // Всегда устанавливаем роль admin
    });

    return this.userRepository.save(user);
  }

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const { email, password } = CreateUserDto;

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя с ролью admin
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [Role.User], // Всегда устанавливаем роль admin
    });

    return this.userRepository.save(user);
  }

  async findAllPag(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return { data, total };
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
}
