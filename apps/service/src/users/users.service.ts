import { Injectable } from "@nestjs/common";
import { UserProfileUpdateDto } from "./dto/users-profile.dto";
import { UserProfileDocument } from "./schemas/users-profile.schema";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { GetUserProfileService } from "./services/get-user-profile.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly updateUserProfileService: UpdateUserProfileService,
    private readonly getUserProfileService: GetUserProfileService
  ) {}

  async updateProfile(
    userId: string,
    dto: UserProfileUpdateDto
  ): Promise<UserProfileDocument> {
    return this.updateUserProfileService.execute(userId, dto);
  }

  async getProfile(userId: string) {
    return this.getUserProfileService.execute(userId);
  }
}
