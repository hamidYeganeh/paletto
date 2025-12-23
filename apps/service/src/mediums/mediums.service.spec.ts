import { Test, TestingModule } from '@nestjs/testing';
import { MediumsService } from './mediums.service';

describe('MediumsService', () => {
  let service: MediumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediumsService],
    }).compile();

    service = module.get<MediumsService>(MediumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
