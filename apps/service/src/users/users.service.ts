import { Injectable } from "@nestjs/common";
import { UserProfileUpdateDto } from "./dto/users-profile.dto";
import { UserProfileDocument } from "./schemas/users-profile.schema";
import { UsersUpdateService } from "./services/users-update.service";
import { UsersProfileService } from "./services/users-profile.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersUpdateService: UsersUpdateService,
    private readonly usersProfileService: UsersProfileService
  ) {}

  async updateProfile(
    userId: string,
    dto: UserProfileUpdateDto
  ): Promise<UserProfileDocument> {
    return this.usersUpdateService.execute(userId, dto);
  }

  async getProfile(userId: string) {
    return this.usersProfileService.execute(userId);
  }
}
