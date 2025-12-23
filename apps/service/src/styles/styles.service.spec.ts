import { Test, TestingModule } from "@nestjs/testing";
import { StylesCreateService } from "./services/styles-create.service";
import { StylesFindOneService } from "./services/styles-find-one.service";
import { StylesListService } from "./services/styles-list.service";
import { StylesUpdateService } from "./services/styles-update.service";
import { StylesService } from "./styles.service";

describe("StylesService", () => {
  let service: StylesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StylesService,
        {
          provide: StylesListService,
          useValue: {},
        },
        {
          provide: StylesCreateService,
          useValue: {},
        },
        {
          provide: StylesUpdateService,
          useValue: {},
        },
        {
          provide: StylesFindOneService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StylesService>(StylesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
