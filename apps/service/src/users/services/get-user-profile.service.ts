import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const userObjectId = this.toObjectId(userId);

    const user = await this.userModel
      .findById(userObjectId)
      .select("email role status createdAt updatedAt")
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(ErrorKeys.USERS_USER_NOT_FOUND);
    }

    const profile = await this.userProfileModel
      .findOne({
        userId: userObjectId,
      })
      .lean()
      .exec();

    return {
      user: {
        ...user,
        _id: user._id.toString(),
      },
      profile: profile
        ? {
            ...profile,
            userId: profile.userId.toString(),
          }
        : {
            userId: userObjectId.toString(),
            name: "",
            bio: undefined,
            blogs: [],
            savedArtworks: [],
            savedBlogs: [],
            likedArtworks: [],
            likedBlogs: [],
            commentedArtworks: [],
            commentedBlogs: [],
          },
    };
  }

  private toObjectId(userId: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(ErrorKeys.USERS_USER_NOT_FOUND);
    }

    return new Types.ObjectId(userId);
  }
}
