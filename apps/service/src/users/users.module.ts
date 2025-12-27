import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UsersListService } from "./services/users-list.service";
import { UsersProfileService } from "./services/users-profile.service";
import { UsersUpdateService } from "./services/users-update.service";
import { UsersAdminControllers } from "./controllers/users-admin.controller";
import { UserProfile, UserProfileSchema } from "./schemas/users-profile.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [UsersController, UsersAdminControllers],
  providers: [
    UsersService,
    UsersListService,
    UsersUpdateService,
    UsersProfileService,
  ],
  exports: [MongooseModule],
})
export class UsersModule {}
