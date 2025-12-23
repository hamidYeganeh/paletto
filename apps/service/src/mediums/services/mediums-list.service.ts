import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Medium, MediumDocument } from "../schemas/mediums.schema";
import { Model, QueryFilter } from "mongoose";
import {
  MediumsListQueryDto,
  MediumsListResponseDto,
} from "../dto/mediums-list.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/list-pagination.constants";

@Injectable()
export class MediumsListService {
  constructor(
    @InjectModel(Medium.name) private readonly mediumModel: Model<MediumDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  buildQuery(query: MediumsListQueryDto): QueryFilter<MediumDocument> {
    const search = query.search?.trim();
    const slug = query.slug;
    const status = query.status;

    const queryObject: QueryFilter<MediumDocument> = {};

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

  async execute(query: MediumsListQueryDto): Promise<MediumsListResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, mediums] = await Promise.all([
      this.mediumModel.countDocuments(filter),
      this.mediumModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
    ]);

    return {
      count,
      mediums,
    };
  }
}
