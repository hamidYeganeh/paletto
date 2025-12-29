import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/users.schema";
import { Model, QueryFilter } from "mongoose";
import { UsersListQueryDto, UsersListResponseDto } from "../dto/users-list.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

@Injectable()
export class ListUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private buildQuery(query: UsersListQueryDto): QueryFilter<UserDocument> {
    const search = query.search?.trim();

    const queryObject: QueryFilter<UserDocument> = {};

    if (search) {
      const safeSearch = this.escapeRegExp(search);
      queryObject.email = { $regex: safeSearch, $options: "i" };
    }

    return queryObject;
  }

  private getSkip(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit;
  }

  async execute(query: UsersListQueryDto): Promise<UsersListResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, users] = await Promise.all([
      this.userModel.countDocuments(filter).exec(),
      this.userModel
        .find(filter)
        .select("_id email role status createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      count,
      users,
    };
  }
}
