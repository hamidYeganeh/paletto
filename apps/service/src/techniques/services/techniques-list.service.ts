import { InjectModel } from "@nestjs/mongoose";
import {
  TechniquesListQueryDto,
  TechniquesListResponseDto,
} from "../dto/techniques-list.dto";
import { Technique, TechniqueDocument } from "../schemas/techniques.schema";
import { Model, QueryFilter } from "mongoose";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/list-pagination.constants";

export class TechniquesListService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniquesModel: Model<TechniqueDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private buildQuery(query: TechniquesListQueryDto) {
    const search = query.search?.trim();
    const slug = query.slug;
    const status = query.status;

    const queryObject: QueryFilter<TechniqueDocument> = {};

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
    query: TechniquesListQueryDto
  ): Promise<TechniquesListResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query?.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, techniques] = await Promise.all([
      this.techniquesModel.countDocuments(filter),
      this.techniquesModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
    ]);

    return {
      count,
      techniques,
    };
  }
}
