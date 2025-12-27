import { Injectable, NotFoundException } from "@nestjs/common";
import {
  UserProfile,
  UserProfileDocument,
} from "../schemas/users-profile.schema";
import { Model, Types } from "mongoose";
import { UserProfileUpdateDto } from "../dto/users-profile.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersUpdateService {
  constructor(
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>
  ) {}

  async execute(
    userId: string,
    dto: UserProfileUpdateDto
  ): Promise<UserProfileDocument> {
    const profile = await this.userProfileModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: dto },
        {
          new: true,
          upsert: true,
        }
      )
      .lean();
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }
}
