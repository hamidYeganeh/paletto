import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter, Types } from "mongoose";

import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  ListArtworksQueryDto,
  ListArtworksResponseDto,
} from "../dto/list-artworks.dto";
import type { ArtistProfileDto } from "../dto/list-artworks.dto";
import { Artist } from "src/users/schemas/artists-profile.schema";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";

const PUBLIC_ARTWORKS_LIST_SELECT =
  "_id artistId title description images createdAt updatedAt";

const ARTIST_PROFILE_SELECT = "_id userId displayName techniques styles";

@Injectable()
export class ListArtworksService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(query: ListArtworksQueryDto): Promise<ListArtworksResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query);
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      count,
      artworks: artworks.map((artwork) => this.mapArtwork(artwork)),
    };
  }

  private buildFilters(
    query: ListArtworksQueryDto
  ): QueryFilter<ArtworkDocument> {
    if (!query.search?.trim()) {
      return {};
    }

    const search = this.escapeRegExp(query.search.trim());

    return {
      $or: [{ title: { $regex: search, $options: "i" } }],
    };
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private isArtistProfile(
    value: Types.ObjectId | ArtistProfileDto | undefined
  ): value is ArtistProfileDto {
    return typeof value === "object" && value !== null && "_id" in value;
  }

  private mapArtwork(
    artwork: ArtworkListLean
  ): ListArtworksResponseDto["artworks"][number] {
    const { artistId, ...rest } = artwork;

    return {
      ...rest,
      artist: this.isArtistProfile(artistId) ? artistId : undefined,
    };
  }
}

type ArtworkListLean = {
  _id: Types.ObjectId;
  artistId?: Types.ObjectId | ArtistProfileDto;
  title: string;
  description?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
};
