import { InjectModel } from "@nestjs/mongoose";
import {
  CategoriesListQueryDto,
  CategoriesListResponseDto,
} from "../dto/categories-list.dto";
import { Category, CategoryDocument } from "../schemas/categories.schema";
import { Model, QueryFilter } from "mongoose";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/list-pagination.constants";

export class CategoriesListService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoriesModel: Model<CategoryDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private buildQuery(query: CategoriesListQueryDto) {
    const search = query.search?.trim();
    const slug = query.slug;
    const status = query.status;

    const queryObject: QueryFilter<CategoryDocument> = {};

    if (status) {
      queryObject.status = status;
    }

    if (slug) {
      const slugs = slug
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      queryObject.slug = slugs.length > 1 ? { $in: slugs } : slugs[0];
    }

    if (search) {
      const safeSearch = this.escapeRegExp(search);
      queryObject.$or = [{ title: { $regex: safeSearch, $options: "i" } }];
    }

    return queryObject;
  }

  private getSkip(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit;
  }

  async execute(
    query: CategoriesListQueryDto
  ): Promise<CategoriesListResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query?.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, categories] = await Promise.all([
      this.categoriesModel.countDocuments(filter),
      this.categoriesModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
    ]);

    return {
      count,
      categories,
    };
  }
}
