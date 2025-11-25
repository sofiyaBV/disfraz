import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Role } from './enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    phone: '+380991234567',
    roles: [Role.User],
  };

  const mockUserService = {
    findByEmailOrPhone: jest.fn(),
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('має бути визначений', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('має успішно виконати вхід з правильними credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockUserService.findByEmailOrPhone.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockJwtService.sign.mockReturnValue('jwt_token_123');

      const result = await service.signIn(email, undefined, password);

      expect(mockUserService.findByEmailOrPhone).toHaveBeenCalledWith(
        email,
        undefined,
      );
      expect(result).toEqual({ access_token: 'jwt_token_123' });
    });

    it('має викинути UnauthorizedException якщо користувач не знайдений', async () => {
      mockUserService.findByEmailOrPhone.mockResolvedValue(null);

      await expect(
        service.signIn('wrong@example.com', undefined, 'password123'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.signIn('wrong@example.com', undefined, 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('має викинути UnauthorizedException якщо пароль невірний', async () => {
      mockUserService.findByEmailOrPhone.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(
        service.signIn('test@example.com', undefined, 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('має виконати вхід через номер телефону', async () => {
      const phone = '+380991234567';
      const password = 'password123';

      mockUserService.findByEmailOrPhone.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockJwtService.sign.mockReturnValue('jwt_token_123');

      const result = await service.signIn(undefined, phone, password);

      expect(mockUserService.findByEmailOrPhone).toHaveBeenCalledWith(
        undefined,
        phone,
      );
      expect(result).toEqual({ access_token: 'jwt_token_123' });
    });
  });

  describe('register', () => {
    it('має успішно зареєструвати користувача з email', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        phone: null,
        roles: [Role.User],
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
      });

      const result = await service.register(createUserDto);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result.email).toBe(createUserDto.email);
    });

    it('має викинути UnauthorizedException якщо email вже існує', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        phone: null,
        roles: [Role.User],
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.register(createUserDto)).rejects.toThrow(
        'Користувач з таким email вже існує',
      );
    });

    it('має викинути UnauthorizedException якщо phone вже існує', async () => {
      const createUserDto = {
        email: null,
        password: 'password123',
        phone: '+380991234567',
        roles: [Role.User],
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.findByPhone.mockResolvedValue(mockUser);

      await expect(service.register(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.register(createUserDto)).rejects.toThrow(
        'Користувач з таким номером телефону вже існує',
      );
    });

    it('має викинути UnauthorizedException якщо не вказано email або phone', async () => {
      const createUserDto = {
        email: null,
        password: 'password123',
        phone: null,
        roles: [Role.User],
      };

      await expect(service.register(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.register(createUserDto)).rejects.toThrow(
        'Email or phone must be provided',
      );
    });
  });

  describe('updateProfile', () => {
    it('має успішно оновити профіль користувача', async () => {
      const updateData = {
        email: 'newemail@example.com',
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.updateUser.mockResolvedValue({
        ...mockUser,
        email: updateData.email,
      });

      const result = await service.updateProfile(1, updateData);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, updateData);
    });

    it('має викинути UnauthorizedException якщо користувач не знайдений', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(
        service.updateProfile(999, { email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.updateProfile(999, { email: 'test@example.com' }),
      ).rejects.toThrow('Користувач не знайдений');
    });

    it('має викинути UnauthorizedException якщо новий email вже існує', async () => {
      const updateData = {
        email: 'existing@example.com',
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockUserService.findByEmail.mockResolvedValue({
        ...mockUser,
        id: 2,
        email: updateData.email,
      });

      await expect(service.updateProfile(1, updateData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.updateProfile(1, updateData)).rejects.toThrow(
        'Користувач з таким email вже існує',
      );
    });

    it('має викинути UnauthorizedException якщо новий phone вже існує', async () => {
      const updateData = {
        phone: '+380991111111',
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockUserService.findByPhone.mockResolvedValue({
        ...mockUser,
        id: 2,
        phone: updateData.phone,
      });

      await expect(service.updateProfile(1, updateData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.updateProfile(1, updateData)).rejects.toThrow(
        'Користувач з таким номером телефону вже існує',
      );
    });

    it('має хешувати пароль при оновленні', async () => {
      const updateData = {
        password: 'newpassword123',
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('$2b$10$hashedNewPassword'));
      mockUserService.updateUser.mockResolvedValue(mockUser);

      await service.updateProfile(1, updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, {
        password: '$2b$10$hashedNewPassword',
      });
    });
  });

  describe('findOrCreateGoogleUser', () => {
    it('має повернути існуючого користувача', async () => {
      const googleData = {
        email: 'test@example.com',
        googleId: 'google123',
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findOrCreateGoogleUser(googleData);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(googleData.email);
      expect(result).toEqual(mockUser);
    });

    it('має створити нового користувача якщо не існує', async () => {
      const googleData = {
        email: 'newgoogleuser@example.com',
        googleId: 'google123',
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({
        ...mockUser,
        email: googleData.email,
      });

      const result = await service.findOrCreateGoogleUser(googleData);

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: googleData.email,
        password: '',
        phone: null,
        roles: [Role.User],
      });
      expect(result.email).toBe(googleData.email);
    });
  });

  describe('generateJwtToken', () => {
    it('має згенерувати JWT токен', async () => {
      const payload = {
        sub: 1,
        email: 'test@example.com',
        roles: [Role.User],
      };

      mockJwtService.sign.mockReturnValue('jwt_token_123');

      const result = await service.generateJwtToken(payload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe('jwt_token_123');
    });
  });
});
