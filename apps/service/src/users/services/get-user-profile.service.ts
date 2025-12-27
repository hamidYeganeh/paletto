import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserProfile } from "../schemas/users-profile.schema";
import { User } from "../schemas/users.schema";
import { ErrorKeys } from "src/common/errors";

@Injectable()
export class GetUserProfileService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(userId: string) {
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .select("email role status createdAt updatedAt")
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(ErrorKeys.USERS_USER_NOT_FOUND);
    }

    const profile = await this.userProfileModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .lean()
      .exec();

    return {
      user,
      profile: profile ?? {
        userId: new Types.ObjectId(userId),
        name: "",
        bio: undefined,
      },
    };
  }
}
