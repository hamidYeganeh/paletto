import { Injectable } from "@nestjs/common";
import { UsersListQueryDto, UsersListResponseDto } from "./dto/users-list.dto";
import { UsersListService } from "./services/users-list.service";
import { UsersCreateService } from "./services/users-create.service";
import { UserCreateDto } from "./dto/users-create.dto";
import { UserDocument } from "./schemas/users.schema";
import { UsersUpdateService } from "./services/users-update.service";
import { UserUpdateDto } from "./dto/users-update.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersListService: UsersListService,
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService
  ) {}

  async getUsersList(query: UsersListQueryDto): Promise<UsersListResponseDto> {
    return this.usersListService.execute(query);
  }

  async createUser(dto: UserCreateDto): Promise<UserDocument> {
    return this.usersCreateService.execute(dto);
  }

  async updateUser(userId: string, dto: UserUpdateDto) {
    return this.usersUpdateService.exectue(userId, dto);
  }
}
