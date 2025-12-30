import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";
import { Style, StyleDocument } from "../schemas/style.schema";
import {
  ListStylesQueryDto,
  ListStylesResponseDto,
} from "../dto/list-styles.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

@Injectable()
export class ListStylesService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(query: ListStylesQueryDto): Promise<ListStylesResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query);
    const sort = this.buildSort(query);
    const skip = Math.max(0, page - 1) * limit;

    const [count, styles] = await Promise.all([
      this.styleModel.countDocuments(filters).exec(),
      this.styleModel
        .find(filters)
        .select("_id title description slug status createdAt updatedAt")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return { count, styles };
  }

  private buildFilters(query: ListStylesQueryDto): QueryFilter<StyleDocument> {
    const filters: QueryFilter<StyleDocument> = {};

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

  private buildSort(query: ListStylesQueryDto): Record<string, 1 | -1> {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
