import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersCreateService } from "./services/users-create.service";
import { UsersListService } from "./services/users-list.service";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersListService,
          useValue: { execute: async () => ({ count: 0, users: [] }) },
        },
        {
          provide: UsersCreateService,
          useValue: { execute: async () => ({ _id: "mock-user-id" }) },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
