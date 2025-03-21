import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    const { email, password } = createAdminDto;

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя с ролью admin
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [Role.Admin],
    });

    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, phone } = createUserDto;

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя с ролью user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      phone,
      roles: [Role.User],
    });

    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Находим пользователя по ID
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    // Обновляем поля, если они переданы
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }

    if (updateUserDto.password) {
      // Хешируем новый пароль, если он передан
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Сохраняем обновленного пользователя
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    // Проверяем, существует ли пользователь
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    // Удаляем пользователя
    await this.userRepository.delete(id);
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
