import { Test, TestingModule } from "@nestjs/testing";
import { TechniquesCreateService } from "./services/techniques-create.service";
import { TechniquesFindOneService } from "./services/techniques-find-one.service";
import { TechniquesListService } from "./services/techniques-list.service";
import { TechniquesUpdateService } from "./services/techniques-update.service";
import { TechniquesService } from "./techniques.service";

describe("TechniquesService", () => {
  let service: TechniquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechniquesService,
        {
          provide: TechniquesListService,
          useValue: {},
        },
        {
          provide: TechniquesCreateService,
          useValue: {},
        },
        {
          provide: TechniquesUpdateService,
          useValue: {},
        },
        {
          provide: TechniquesFindOneService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TechniquesService>(TechniquesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
