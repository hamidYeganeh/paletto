import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateUserStatusDto } from "../dto/update-user-status.dto";
import { User, UserDocument } from "../schemas/users.schema";

@Injectable()
export class UpdateUserStatusService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async execute(dto: UpdateUserStatusDto): Promise<UserDocument> {
    const userId = dto.userId?.trim();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user id");
    }

    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
