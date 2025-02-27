import { Test, TestingModule } from '@nestjs/testing';
import { AttributesController } from './attribute.controller';
import { AttributesService } from './attribute.service';

describe('AttributeController', () => {
  let controller: AttributesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributesController],
      providers: [AttributesService],
    }).compile();

    controller = module.get<AttributesController>(AttributesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
