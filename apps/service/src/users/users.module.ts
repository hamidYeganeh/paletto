import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { UsersListService } from "./services/users-list.service";
import { UsersCreateService } from "./services/users-create.service";
import { UsersUpdateService } from "./services/users-update.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersListService,
    UsersCreateService,
    UsersUpdateService,
  ],
})
export class UsersModule {}
