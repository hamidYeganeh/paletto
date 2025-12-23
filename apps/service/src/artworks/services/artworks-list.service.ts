import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter, Types } from "mongoose";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/list-pagination.constants";
import {
  ArtworksListQueryDto,
  ArtworksListResponseDto,
} from "../dto/artworks-list.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";

@Injectable()
export class ArtworksListService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private parseObjectIdList(value?: string): Types.ObjectId[] | undefined {
    if (!value) return undefined;

    const parts = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (parts.length === 0) return undefined;

    const invalid = parts.find((item) => !Types.ObjectId.isValid(item));
    if (invalid) {
      throw new BadRequestException(`Invalid id: ${invalid}`);
    }

    return parts.map((item) => new Types.ObjectId(item));
  }

  buildQuery(query: ArtworksListQueryDto): QueryFilter<ArtworkDocument> {
    const search = query.search?.trim();
    const status = query.status;
    const artistID = query.artistID;
    const artistObjectId =
      artistID && Types.ObjectId.isValid(artistID)
        ? new Types.ObjectId(artistID)
        : undefined;

    const categories = this.parseObjectIdList(query.categories);
    const techniques = this.parseObjectIdList(query.techniques);
    const mediums = this.parseObjectIdList(query.mediums);
    const materials = this.parseObjectIdList(query.materials);

    const tags = query.tags
      ? query.tags
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : undefined;

    const queryObject: QueryFilter<ArtworkDocument> = {};

    if (status) {
      queryObject.status = status;
    }

    if (artistID && !artistObjectId) {
      throw new BadRequestException("Invalid artist id");
    }

    if (artistObjectId) {
      queryObject.artistID = artistObjectId;
    }

    if (categories?.length) {
      queryObject.categories = { $in: categories };
    }

    if (techniques?.length) {
      queryObject.techniques = { $in: techniques };
    }

    if (mediums?.length) {
      queryObject.mediums = { $in: mediums };
    }

    if (materials?.length) {
      queryObject.materials = { $in: materials };
    }

    if (tags?.length) {
      queryObject.tags = { $in: tags };
    }

    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    if (minPrice !== undefined || maxPrice !== undefined) {
      if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        minPrice > maxPrice
      ) {
        throw new BadRequestException("minPrice cannot be greater than maxPrice");
      }
      queryObject.price = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }

    const minYear = query.minYear;
    const maxYear = query.maxYear;
    if (minYear !== undefined || maxYear !== undefined) {
      if (minYear !== undefined && maxYear !== undefined && minYear > maxYear) {
        throw new BadRequestException("minYear cannot be greater than maxYear");
      }
      queryObject.year = {
        ...(minYear !== undefined ? { $gte: minYear } : {}),
        ...(maxYear !== undefined ? { $lte: maxYear } : {}),
      };
    }

    if (search) {
      const safeSearch = this.escapeRegExp(search);
      queryObject.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { tags: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return queryObject;
  }

  private getSkip(page: number, limit: number): number {
    return Math.max(0, page - 1) * limit;
  }

  async execute(query: ArtworksListQueryDto): Promise<ArtworksListResponseDto> {
    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filter = this.buildQuery(query);
    const skip = this.getSkip(page, limit);

    const [count, artworks] = await Promise.all([
      this.artworkModel.countDocuments(filter),
      this.artworkModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "artist",
          select: "name email role status artistProfile createdAt",
        })
        .populate({ path: "categories", select: "title slug status" })
        .populate({ path: "techniques", select: "title slug status" })
        .populate({ path: "mediums", select: "title slug status" })
        .exec(),
    ]);

    return { count, artworks };
  }
}
