import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/users.schema";
import { Model, QueryFilter } from "mongoose";
import {
  ListUsersQueryDto,
  ListUsersResponseDto,
} from "../dto/list-users.dto";
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

  private buildFilters(query: ListUsersQueryDto): QueryFilter<UserDocument> {
    const filters: QueryFilter<UserDocument> = {};

    if (query.status) {
      filters.status = query.status;
    }

    if (!query.search?.trim()) {
      return filters;
    }

    const safeSearch = this.escapeRegExp(query.search.trim());

    return {
      ...filters,
      email: { $regex: safeSearch, $options: "i" },
    };
  }

  private getSkip(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit;
  }

  private getSort(
    query: ListUsersQueryDto
  ): Record<string, 1 | -1> {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }

  async execute(query: ListUsersQueryDto): Promise<ListUsersResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildFilters(query);
    const sort = this.getSort(query);
    const skip = this.getSkip(page, limit);

    const [count, users] = await Promise.all([
      this.userModel.countDocuments(filter).exec(),
      this.userModel
        .find(filter)
        .select("_id email role status createdAt updatedAt")
        .sort(sort)
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
