import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
import { Category, CategoryDocument } from "../schemas/category.schema";
import {
  ListCategoriesQueryDto,
  ListCategoriesResponseDto,
} from "../dto/list-categories.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

@Injectable()
export class ListCategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(
    query: ListCategoriesQueryDto
  ): Promise<ListCategoriesResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query);
    const sort = this.buildSort(query);
    const skip = Math.max(0, page - 1) * limit;

    const [count, categories] = await Promise.all([
      this.categoryModel.countDocuments(filters).exec(),
      this.categoryModel
        .find(filters)
        .select("_id title description slug status createdAt updatedAt")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return { count, categories };
  }

  private buildFilters(
    query: ListCategoriesQueryDto
  ): QueryFilter<CategoryDocument> {
    const filters: QueryFilter<CategoryDocument> = {};

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

  private buildSort(
    query: ListCategoriesQueryDto
  ): Record<string, 1 | -1> {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
