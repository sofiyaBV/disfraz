import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { ImageService } from './image.service';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;
  let attributeRepository: Repository<Attribute>;
  let imageService: ImageService;
  let entityManager: EntityManager;

  const mockProduct = {
    id: 1,
    name: 'Тестовий костюм',
    price: 100,
    discount: 10,
    topSale: false,
    newPrice: 90,
    description: 'Опис тестового костюма',
    images: [],
    attributes: [],
    similarProducts: [],
  };

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockAttributeRepository = {
    find: jest.fn(),
  };

  const mockImageService = {
    uploadMany: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockEntityManager = {
    transaction: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Attribute),
          useValue: mockAttributeRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: ImageService,
          useValue: mockImageService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    attributeRepository = module.get<Repository<Attribute>>(
      getRepositoryToken(Attribute),
    );
    entityManager = module.get<EntityManager>(EntityManager);
    imageService = module.get<ImageService>(ImageService);

    // Очистити всі моки перед кожним тестом
    jest.clearAllMocks();
  });

  it('має бути визначений', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('має створити продукт без зображень', async () => {
      const createProductDto = {
        name: 'Новий костюм',
        price: 200,
        discount: 15,
      };

      mockProductRepository.create.mockReturnValue(mockProduct);
      mockProductRepository.save.mockResolvedValue(mockProduct);
      mockImageService.uploadMany.mockResolvedValue([]);

      const result = await service.create(createProductDto, []);

      expect(mockProductRepository.create).toHaveBeenCalled();
      expect(mockProductRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('має створити продукт зі зображеннями', async () => {
      const createProductDto = {
        name: 'Новий костюм',
        price: 200,
      };

      const mockFiles = [{ originalname: 'test.jpg' }] as Express.Multer.File[];
      const mockImageData = [
        { url: 'http://test.com/image.jpg', deleteHash: 'abc123' },
      ];

      mockImageService.uploadMany.mockResolvedValue(mockImageData);
      mockProductRepository.create.mockReturnValue({
        ...mockProduct,
        images: mockImageData,
      });
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        images: mockImageData,
      });

      const result = await service.create(createProductDto, mockFiles);

      expect(mockImageService.uploadMany).toHaveBeenCalledWith(mockFiles);
      expect(result.images).toEqual(mockImageData);
    });
  });

  describe('findAll', () => {
    it('має повернути масив продуктів', async () => {
      const mockProducts = [mockProduct];
      mockProductRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(mockProductRepository.find).toHaveBeenCalledWith({
        relations: ['attributes', 'similarProducts'],
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('має повернути один продукт за ID', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['attributes', 'similarProducts'],
      });
      expect(result).toEqual(mockProduct);
    });

    it('має викинути NotFoundException якщо продукт не знайдено', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Продукт з ID 999 не знайдено',
      );
    });
  });

  describe('remove', () => {
    it('має видалити продукт за ID', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('має видалити зображення разом з продуктом', async () => {
      const productWithImages = {
        ...mockProduct,
        images: [{ url: 'http://test.com/image.jpg', deleteHash: 'abc123' }],
      };

      mockProductRepository.findOne.mockResolvedValue(productWithImages);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockImageService.deleteMany).toHaveBeenCalledWith(
        productWithImages.images,
      );
    });

    it('має викинути NotFoundException якщо продукт не існує', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
