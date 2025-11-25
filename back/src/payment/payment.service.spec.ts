import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../order/enums/order-status.enum';

// Мокаємо Stripe перед імпортом сервісу
jest.mock('stripe', () => {
  const mockStripe = jest.fn().mockImplementation(() => ({
    paymentMethods: {
      retrieve: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
  return { __esModule: true, default: mockStripe };
});

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    phone: '+380991234567',
    roles: ['user'],
  };

  const mockOrder = {
    id: 1,
    price: 280,
    status: 'Pending',
    user: mockUser,
    quantity: 3,
    productAttributeIds: [1, 2],
    createdAt: new Date(),
  };

  const mockPayment = {
    id: 1,
    orderId: 1,
    amount: 280,
    currency: 'UAH',
    status: PaymentStatus.SUCCEEDED,
    stripePaymentIntentId: 'pi_test123',
    last4: '4242',
    cardType: 'visa',
  };

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockStripe = {
    paymentMethods: {
      retrieve: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Встановлюємо STRIPE_SECRET_KEY для тестів
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Підміняємо stripe об'єкт для тестів
    (service as any).stripe = mockStripe;

    jest.clearAllMocks();
  });

  it('має бути визначений', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('має повернути всі платежі', async () => {
      const mockPayments = [mockPayment];
      mockPaymentRepository.find.mockResolvedValue(mockPayments);

      const result = await service.findAll();

      expect(mockPaymentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockPayments);
    });
  });

  describe('findOne', () => {
    it('має повернути платіж за ID', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(mockPaymentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPayment);
    });

    it('має викинути NotFoundException якщо платіж не знайдено', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Платіж з ID 999 не знайдено',
      );
    });
  });

  describe('update', () => {
    it('має оновити платіж', async () => {
      const updateDto = {
        description: 'Оновлений опис платежу',
      };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.update.mockResolvedValue({ affected: 1 });
      mockPaymentRepository.findOne.mockResolvedValueOnce(mockPayment);
      mockPaymentRepository.findOne.mockResolvedValueOnce({
        ...mockPayment,
        description: 'Оновлений опис платежу',
      });

      const result = await service.update(1, updateDto);

      expect(mockPaymentRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('має викинути BadRequestException при спробі змінити amount', async () => {
      const updateDto = {
        amount: 500,
      };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Оновлення суми платежу не допускається після створення',
      );
    });
  });

  describe('remove', () => {
    it('має видалити платіж за ID', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockPaymentRepository.findOne).toHaveBeenCalled();
      expect(mockPaymentRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Платіж #1 видалено' });
    });

    it('має викинути NotFoundException якщо платіж не існує', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('має викинути NotFoundException якщо користувача не знайдено', async () => {
      const createPaymentDto = {
        orderId: 1,
        currency: 'UAH',
        paymentMethodId: 'pm_test123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createPaymentDto, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('має викинути NotFoundException якщо замовлення не знайдено', async () => {
      const createPaymentDto = {
        orderId: 999,
        currency: 'UAH',
        paymentMethodId: 'pm_test123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('має викинути BadRequestException якщо замовлення вже оплачено', async () => {
      const createPaymentDto = {
        orderId: 1,
        currency: 'UAH',
        paymentMethodId: 'pm_test123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockPaymentRepository.findOne.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.SUCCEEDED,
      });

      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        'Замовлення #1 вже оплачено',
      );
    });

    it('має викинути BadRequestException якщо декілька неоплачених замовлень', async () => {
      const createPaymentDto = {
        currency: 'UAH',
        paymentMethodId: 'pm_test123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockOrderRepository.find.mockResolvedValue([
        mockOrder,
        { ...mockOrder, id: 2 },
      ]);

      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        'У вас кілька неоплачених замовлень',
      );
    });

    it('має викинути NotFoundException якщо немає неоплачених замовлень', async () => {
      const createPaymentDto = {
        currency: 'UAH',
        paymentMethodId: 'pm_test123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockOrderRepository.find.mockResolvedValue([]);

      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createPaymentDto, 1)).rejects.toThrow(
        'У користувача немає неоплачених замовлень',
      );
    });
  });
});
