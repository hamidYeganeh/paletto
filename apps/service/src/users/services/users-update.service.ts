import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/users.schema";
import { Model, UpdateQuery } from "mongoose";
import { UserUpdateDto } from "../dto/users-update.dto";

@Injectable()
export class UsersUpdateService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async exectue(userId: string, dto: UserUpdateDto) {
    const updateQuery: UpdateQuery<UserDocument> = {};
    try {
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key !== "userProfile") {
            updateQuery[key] = value;
          }
        }
      });

      if (dto.userProfile) {
        Object.entries(dto).forEach(([key, value]) => {
          if (value !== undefined) {
            updateQuery[`userProfile.${key}`] = value;
          }
        });
      }

      if (dto.artistProfile) {
        Object.entries(dto).forEach(([key, value]) => {
          if (value !== undefined) {
            updateQuery[`artistProfile.${key}`] = value;
          }
        });
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $set: updateQuery },
          { new: true, runValidators: true }
        )
        .exec();
    } catch (error) {}
  }
}
