import { Test, TestingModule } from '@nestjs/testing';
import { AttributesService } from './attribute.service';

describe('AttributeService', () => {
  let service: AttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributesService],
    }).compile();

    service = module.get<AttributesService>(AttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
