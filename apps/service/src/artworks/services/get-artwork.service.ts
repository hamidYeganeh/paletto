import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter, Types } from "mongoose";
import { Artist } from "src/users/schemas/artists-profile.schema";
import { GetArtworkDto } from "../dto/get-artwork.dto";
import type { ArtworkListItemDto } from "../dto/list-artworks.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import { ArtworkStatus } from "../enums/artwork-status.enum";
import {
  ARTIST_PROFILE_SELECT,
  mapArtworkListItem,
  PUBLIC_ARTWORKS_LIST_SELECT,
  TAXONOMY_LIST_SELECT,
} from "../utils/artwork-list-mapper";
import { Technique } from "src/techniques/schemas/technique.schema";
import { Style } from "src/styles/schemas/style.schema";
import { Category } from "src/categories/schemas/category.schema";

@Injectable()
export class GetArtworkService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(
    dto: GetArtworkDto,
    options: { publicOnly?: boolean } = {}
  ): Promise<ArtworkListItemDto> {
    const artworkObjectId = this.toObjectId(
      dto.artworkId,
      "Invalid artwork id"
    );

    const filters = this.buildFilters(artworkObjectId, options);

    const artwork = await this.artworkModel
      .findOne(filters)
      .select(PUBLIC_ARTWORKS_LIST_SELECT)
      .populate({
        path: "artistId",
        select: ARTIST_PROFILE_SELECT,
        model: Artist.name,
      })
      .populate({
        path: "techniques",
        select: TAXONOMY_LIST_SELECT,
        model: Technique.name,
      })
      .populate({
        path: "styles",
        select: TAXONOMY_LIST_SELECT,
        model: Style.name,
      })
      .populate({
        path: "categories",
        select: TAXONOMY_LIST_SELECT,
        model: Category.name,
      })
      .lean()
      .exec();

    if (!artwork) {
      throw new NotFoundException("Artwork not found");
    }

    return mapArtworkListItem(artwork);
  }

  private buildFilters(
    artworkId: Types.ObjectId,
    options: { publicOnly?: boolean }
  ): QueryFilter<ArtworkDocument> {
    const filters: QueryFilter<ArtworkDocument> = { _id: artworkId };

    if (options.publicOnly) {
      filters.status = ArtworkStatus.ACTIVE;
      filters.$and = [
        {
          $or: [
            { isScheduled: { $ne: true } },
            { publishAt: { $lte: new Date() } },
          ],
        },
      ];
    }

    return filters;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
