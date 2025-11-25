import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let cartRepository: Repository<Cart>;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    phone: '+380991234567',
    roles: ['user'],
  };

  const mockCartItems = [
    {
      id: 1,
      quantity: 2,
      price: 180,
      productAttribute: { id: 1 },
      user: mockUser,
    },
    {
      id: 2,
      quantity: 1,
      price: 100,
      productAttribute: { id: 2 },
      user: mockUser,
    },
  ];

  const mockOrder = {
    id: 1,
    productAttributeIds: [1, 2],
    quantity: 3,
    price: 280,
    status: 'Pending',
    user: mockUser,
    firstName: 'Іван',
    lastName: 'Петренко',
    phone: '+380991234567',
  };

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCartRepository = {};
  const mockUserRepository = {};

  const mockEntityManager = {
    transaction: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    entityManager = module.get<EntityManager>(EntityManager);

    jest.clearAllMocks();
  });

  it('має бути визначений', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('має створити замовлення з елементів кошика', async () => {
      const createOrderDto = {
        customerName: 'Іван Петренко',
        customerEmail: 'ivan@example.com',
        customerPhone: '+380991234567',
        deliveryAddress: 'Київ, вул. Хрещатик 1',
        deliveryMethod: 'Самовивіз' as any,
        status: 'Pending',
      };

      mockEntityManager.transaction.mockImplementation(async (callback) => {
        return callback(mockEntityManager);
      });

      mockEntityManager.findOne.mockResolvedValue(mockUser);
      mockEntityManager.find.mockResolvedValue(mockCartItems);
      mockEntityManager.create.mockReturnValue(mockOrder);
      mockEntityManager.save.mockResolvedValue(mockOrder);
      mockEntityManager.delete.mockResolvedValue({ affected: 2 });

      const result = await service.create(createOrderDto, 1);

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: 1 },
      });
      expect(mockEntityManager.find).toHaveBeenCalledWith(Cart, {
        where: { user: { id: 1 } },
        relations: ['user', 'productAttribute'],
      });
      expect(result).toEqual(mockOrder);
      expect(mockEntityManager.delete).toHaveBeenCalledWith(Cart, {
        user: { id: 1 },
      });
    });

    it('має викинути NotFoundException якщо користувача не знайдено', async () => {
      mockEntityManager.transaction.mockImplementation(async (callback) => {
        return callback(mockEntityManager);
      });

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(
        service.create(
          {
            customerName: 'Іван Петренко',
            customerEmail: 'ivan@example.com',
            customerPhone: '+380991234567',
            deliveryAddress: 'Київ',
            deliveryMethod: 'Самовивіз' as any,
          },
          999,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('має викинути NotFoundException якщо кошик порожній', async () => {
      mockEntityManager.transaction.mockImplementation(async (callback) => {
        return callback(mockEntityManager);
      });

      mockEntityManager.findOne.mockResolvedValue(mockUser);
      mockEntityManager.find.mockResolvedValue([]);

      await expect(
        service.create(
          {
            customerName: 'Іван Петренко',
            customerEmail: 'ivan@example.com',
            customerPhone: '+380991234567',
            deliveryAddress: 'Київ',
            deliveryMethod: 'Самовивіз' as any,
          },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('має правильно підрахувати загальну кількість та ціну', async () => {
      const createOrderDto = {
        customerName: 'Іван Петренко',
        customerEmail: 'ivan@example.com',
        customerPhone: '+380991234567',
        deliveryAddress: 'Київ',
        deliveryMethod: 'Самовивіз' as any,
      };

      mockEntityManager.transaction.mockImplementation(async (callback) => {
        return callback(mockEntityManager);
      });

      mockEntityManager.findOne.mockResolvedValue(mockUser);
      mockEntityManager.find.mockResolvedValue(mockCartItems);
      mockEntityManager.create.mockImplementation((entity, data) => data);
      mockEntityManager.save.mockImplementation((entity, data) =>
        Promise.resolve(data),
      );

      await service.create(createOrderDto, 1);

      expect(mockEntityManager.create).toHaveBeenCalledWith(
        Order,
        expect.objectContaining({
          quantity: 3, // 2 + 1
          price: 280, // 180 + 100
          productAttributeIds: [1, 2],
        }),
      );
    });
  });

  describe('findAll', () => {
    it('має повернути всі замовлення', async () => {
      const mockOrders = [mockOrder];
      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOne', () => {
    it('має повернути одне замовлення за ID', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('має викинути NotFoundException якщо замовлення не знайдено', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Замовлення з ID 999 не знайдено',
      );
    });
  });

  describe('update', () => {
    it('має оновити замовлення', async () => {
      const updateDto = {
        status: 'Completed',
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.update.mockResolvedValue({ affected: 1 });
      mockOrderRepository.findOne.mockResolvedValueOnce(mockOrder);
      mockOrderRepository.findOne.mockResolvedValueOnce({
        ...mockOrder,
        status: 'Completed',
      });

      const result = await service.update(1, updateDto);

      expect(mockOrderRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('має видалити замовлення за ID', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockOrderRepository.findOne).toHaveBeenCalled();
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
    });

    it('має викинути NotFoundException якщо замовлення не існує', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
