import { Test, TestingModule } from '@nestjs/testing';
import { MediumsController } from './mediums.controller';

describe('MediumsController', () => {
  let controller: MediumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediumsController],
    }).compile();

    controller = module.get<MediumsController>(MediumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
