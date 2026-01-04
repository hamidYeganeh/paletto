import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import {
  ListBlogsQueryDto,
  ListBlogsResponseDto,
} from "../dto/list-blogs.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

@Injectable()
export class ListBlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(query: ListBlogsQueryDto): Promise<ListBlogsResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query);
    const sort = this.buildSort(query);
    const skip = Math.max(0, page - 1) * limit;

    const [count, blogs] = await Promise.all([
      this.blogModel.countDocuments(filters).exec(),
      this.blogModel
        .find(filters)
        .select(
          "_id title description slug status cover authorId createdAt updatedAt"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return { count, blogs };
  }

  private buildFilters(
    query: ListBlogsQueryDto
  ): QueryFilter<BlogDocument> {
    const filters: QueryFilter<BlogDocument> = {};

    if (query.status?.trim()) {
      filters.status = query.status.trim();
    }

    if (query.search?.trim()) {
      const search = this.escapeRegExp(query.search.trim());
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    return filters;
  }

  private buildSort(query: ListBlogsQueryDto): Record<string, 1 | -1> {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
