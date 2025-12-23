import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import bcrypt from "bcrypt";
import { Model } from "mongoose";
import { UserCreateDto } from "../dto/users-create.dto";
import { User, UserDocument } from "../schemas/users.schema";

@Injectable()
export class UsersCreateService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async execute(dto: UserCreateDto): Promise<UserDocument> {
    try {
      const password = await bcrypt.hash(dto.password, 10);
      const created = await this.userModel.create({
        ...dto,
        password,
      });

      return created;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException("Email already in use");
      }

      throw new InternalServerErrorException("Failed to create user");
    }
  }
}
