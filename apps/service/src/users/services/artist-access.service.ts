import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IUserRoles } from "../enums/users-role.enum";
import { IUserStatus } from "../enums/users-status.enum";
import { User, UserDocument } from "../schemas/users.schema";

@Injectable()
export class ArtistAccessService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async ensureActiveUser(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel
      .findById(userId)
      .select("role status")
      .exec();

    if (!user || user.status !== IUserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async ensureArtistRole(userId: Types.ObjectId, role: IUserRoles): Promise<void> {
    if (role !== IUserRoles.ARTIST) {
      await this.userModel
        .findByIdAndUpdate(
          { _id: userId },
          { $set: { role: IUserRoles.ARTIST } }
        )
        .exec();
    }
  }
}
