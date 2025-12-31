import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { CreateArtistService } from "./services/create-artist.service";
import { GetUserProfileService } from "./services/get-user-profile.service";
import { ListUsersService } from "./services/list-users.service";
import { UpdateArtistService } from "./services/update-artist.service";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { UpdateUserStatusService } from "./services/update-user-status.service";

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UpdateUserProfileService, useValue: {} },
        { provide: GetUserProfileService, useValue: {} },
        { provide: CreateArtistService, useValue: {} },
        { provide: UpdateArtistService, useValue: {} },
        { provide: ListUsersService, useValue: {} },
        { provide: UpdateUserStatusService, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
