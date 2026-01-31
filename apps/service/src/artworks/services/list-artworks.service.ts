import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter } from "mongoose";

import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  ListArtworksQueryDto,
  ListArtworksResponseDto,
} from "../dto/list-artworks.dto";
import { Artist } from "src/users/schemas/artists-profile.schema";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";
import {
  ARTIST_PROFILE_SELECT,
  mapArtworkListItem,
  PUBLIC_ARTWORKS_LIST_SELECT,
  ARTWORK_LOOKUP_SELECT,
} from "../utils/artwork-list-mapper";
import { Technique } from "src/techniques/schemas/technique.schema";
import { Style } from "src/styles/schemas/style.schema";
import { Category } from "src/categories/schemas/category.schema";

@Injectable()
export class ListArtworksService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(
    query: ListArtworksQueryDto
  ): Promise<ListArtworksResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query);
    const sort = this.buildSort(query);
    const skip = Math.max(0, page - 1) * limit;

    const [count, artworks] = await Promise.all([
      this.artworkModel.countDocuments(filters).exec(),
      this.artworkModel
        .find(filters)
        .select(PUBLIC_ARTWORKS_LIST_SELECT)
        .populate({
          path: "artistId",
          select: ARTIST_PROFILE_SELECT,
          model: Artist.name,
        })
        .populate({
          path: "techniques",
          select: ARTWORK_LOOKUP_SELECT,
          model: Technique.name,
        })
        .populate({
          path: "styles",
          select: ARTWORK_LOOKUP_SELECT,
          model: Style.name,
        })
        .populate({
          path: "categories",
          select: ARTWORK_LOOKUP_SELECT,
          model: Category.name,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      count,
      artworks: artworks.map((artwork) => mapArtworkListItem(artwork)),
    };
  }

  private buildFilters(
    query: ListArtworksQueryDto
  ): QueryFilter<ArtworkDocument> {
    const filters: QueryFilter<ArtworkDocument> = {};

    if (query.status?.trim()) {
      filters.status = query.status.trim();
    }

    if (query.search?.trim()) {
      const search = this.escapeRegExp(query.search.trim());
      filters.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    if (query.techniques?.length) {
      filters.techniques = { $in: query.techniques };
    }

    if (query.styles?.length) {
      filters.styles = { $in: query.styles };
    }

    if (query.categories?.length) {
      filters.categories = { $in: query.categories };
    }

    if (query.tags?.length) {
      filters.tags = { $in: query.tags };
    }

    return filters;
  }

  private buildSort(
    query: ListArtworksQueryDto
  ): Record<string, 1 | -1> {
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";

    return { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
