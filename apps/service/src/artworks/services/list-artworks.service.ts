import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import { Model, QueryFilter } from "mongoose";
import {
  ListArtworksQueryDto,
  ListArtworksResponseDto,
} from "../dto/list-artworks.dto";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

@Injectable()
export class ListArtworksService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private buildQuery(
    query: ListArtworksQueryDto
  ): QueryFilter<ArtworkDocument> {
    const search = query.search?.trim();

    const queryObject: QueryFilter<ArtworkDocument> = {};

    if (search) {
      const safeSearch = this.escapeRegExp(search);

      queryObject.$or = [
        {
          title: { $regex: safeSearch, $options: "i" },
        },
      ];
    }

    return queryObject;
  }

  private getSkip(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit;
  }

  async execute(query: ListArtworksQueryDto): Promise<ListArtworksResponseDto> {
    const page = query?.page ?? DEFAULT_LIST_PAGE;
    const limit = query?.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, artworks] = await Promise.all([
      this.artworkModel.countDocuments(filters),
      this.artworkModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    ]);

    return {
      count,
      artworks,
    };
  }
}
