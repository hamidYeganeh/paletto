import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { ListUsersService } from "./services/list-users.service";
import { GetUserProfileService } from "./services/get-user-profile.service";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { UsersAdminController } from "./controllers/users-admin.controller";
import { UserProfile, UserProfileSchema } from "./schemas/users-profile.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [
    UsersService,
    ListUsersService,
    UpdateUserProfileService,
    GetUserProfileService,
  ],
  exports: [MongooseModule],
})
export class UsersModule {}
