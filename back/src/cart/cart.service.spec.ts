import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { ProductAttribute } from '../product-attribute/entities/product-attribute.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let productAttributeRepository: Repository<ProductAttribute>;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    phone: '+380991234567',
    roles: ['user'],
  };

  const mockProduct = {
    id: 1,
    name: 'Тестовий продукт',
    price: 100,
    discount: 10,
    newPrice: 90,
    topSale: false,
    description: 'Опис',
    images: [],
  };

  const mockProductAttribute = {
    id: 1,
    product: mockProduct,
  };

  const mockCart = {
    id: 1,
    productAttribute: mockProductAttribute,
    user: mockUser,
    quantity: 2,
    price: 180, // 90 * 2
    addedAt: new Date(),
  };

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductAttributeRepository = {
    findOneOrFail: jest.fn(),
  };

  const mockUserRepository = {
    findOneOrFail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(ProductAttribute),
          useValue: mockProductAttributeRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    productAttributeRepository = module.get<Repository<ProductAttribute>>(
      getRepositoryToken(ProductAttribute),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('має бути визначений', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('має створити елемент кошика з newPrice якщо є знижка', async () => {
      const createCartDto = {
        productAttributeId: 1,
        quantity: 2,
      };

      mockProductAttributeRepository.findOneOrFail.mockResolvedValue(
        mockProductAttribute,
      );
      mockUserRepository.findOneOrFail.mockResolvedValue(mockUser);
      mockCartRepository.create.mockReturnValue(mockCart);
      mockCartRepository.save.mockResolvedValue(mockCart);

      const result = await service.create(createCartDto, 1);

      expect(mockProductAttributeRepository.findOneOrFail).toHaveBeenCalledWith(
        {
          where: { id: 1 },
          relations: ['product'],
        },
      );
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockCartRepository.create).toHaveBeenCalled();
      expect(mockCartRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('має використовувати звичайну ціну якщо немає знижки', async () => {
      const productWithoutDiscount = {
        ...mockProduct,
        discount: 0,
        newPrice: null,
      };

      const createCartDto = {
        productAttributeId: 1,
        quantity: 1,
      };

      mockProductAttributeRepository.findOneOrFail.mockResolvedValue({
        id: 1,
        product: productWithoutDiscount,
      });
      mockUserRepository.findOneOrFail.mockResolvedValue(mockUser);
      mockCartRepository.create.mockReturnValue({
        ...mockCart,
        price: 100,
      });
      mockCartRepository.save.mockResolvedValue({
        ...mockCart,
        price: 100,
      });

      const result = await service.create(createCartDto, 1);

      expect(result.price).toBe(100);
    });
  });

  describe('findByUserId', () => {
    it('має повернути кошик користувача за userId', async () => {
      const mockCarts = [mockCart];
      mockCartRepository.find.mockResolvedValue(mockCarts);

      const result = await service.findByUserId(1);

      expect(mockCartRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: [
          'productAttribute',
          'productAttribute.product',
          'productAttribute.attribute',
        ],
      });
      expect(result).toEqual(mockCarts);
    });
  });

  describe('findOne', () => {
    it('має повернути один елемент кошика за ID', async () => {
      mockCartRepository.findOneOrFail.mockResolvedValue(mockCart);

      const result = await service.findOne(1);

      expect(mockCartRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'productAttribute',
          'productAttribute.product',
          'productAttribute.attribute',
          'user',
        ],
      });
      expect(result).toEqual(mockCart);
    });
  });

  describe('update', () => {
    it('має оновити кількість та перерахувати ціну', async () => {
      const updateDto = {
        quantity: 3,
      };

      mockCartRepository.findOneOrFail.mockResolvedValue(mockCart);
      mockCartRepository.save.mockResolvedValue({
        ...mockCart,
        quantity: 3,
        price: 270, // 90 * 3
      });

      const result = await service.update(1, updateDto);

      expect(mockCartRepository.findOneOrFail).toHaveBeenCalled();
      expect(mockCartRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('має видалити елемент кошика за ID', async () => {
      mockCartRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockCartRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('має повернути всі елементи кошика', async () => {
      const mockCarts = [mockCart];
      mockCartRepository.find.mockResolvedValue(mockCarts);

      const result = await service.findAll();

      expect(mockCartRepository.find).toHaveBeenCalledWith({
        relations: [
          'productAttribute',
          'productAttribute.product',
          'productAttribute.attribute',
          'user',
        ],
      });
      expect(result).toEqual(mockCarts);
    });
  });
});
