import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Artist } from "src/users/schemas/artists-profile.schema";
import { GetArtworkDto } from "../dto/get-artwork.dto";
import type { ArtworkListItemDto } from "../dto/list-artworks.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  ARTIST_PROFILE_SELECT,
  mapArtworkListItem,
  PUBLIC_ARTWORKS_LIST_SELECT,
} from "../utils/artwork-list-mapper";

@Injectable()
export class GetArtworkService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(dto: GetArtworkDto): Promise<ArtworkListItemDto> {
    const artworkObjectId = this.toObjectId(dto.artworkId, "Invalid artwork id");
    const artistObjectId = this.toObjectId(dto.artistId, "Invalid artist id");

    const artwork = await this.artworkModel
      .findOne({ _id: artworkObjectId, artistId: artistObjectId })
      .select(PUBLIC_ARTWORKS_LIST_SELECT)
      .populate({
        path: "artistId",
        select: ARTIST_PROFILE_SELECT,
        model: Artist.name,
      })
      .lean()
      .exec();

    if (!artwork) {
      throw new NotFoundException("Artwork not found");
    }

    return mapArtworkListItem(artwork);
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
