import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateArtworkDto } from "../dto/create-artwork.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  Artist,
  ArtistDocument,
} from "src/users/schemas/artists-profile.schema";
import { ArtistAccessService } from "src/users/services/artist-access.service";
import { normalizeImages } from "../utils/normalize-images";
import { ArtworkStatus } from "../enums/artwork-status.enum";
import { normalizeTags } from "src/common/tags";

@Injectable()
export class CreateArtworkService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly artistAccessService: ArtistAccessService
  ) {}

  async execute(
    userId: string,
    dto: CreateArtworkDto
  ): Promise<ArtworkDocument> {
    const userObjectId = new Types.ObjectId(userId);

    await this.artistAccessService.ensureActiveUser(userObjectId);

    const artist = await this.artistModel
      .findOne({ userId: userObjectId })
      .exec();

    if (!artist) {
      throw new NotFoundException("Artist profile not found");
    }

    const images = normalizeImages(dto.images) ?? [];
    const techniques = dto.techniques ?? [];
    const styles = dto.styles ?? [];
    const categories = dto.categories ?? [];
    const tags = normalizeTags(dto.tags);
    const status = dto.status ?? ArtworkStatus.DRAFT;

    const artwork = await this.artworkModel.create({
      artistId: artist._id,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      images,
      techniques,
      styles,
      categories,
      tags,
      status,
    });

    await this.artistModel
      .findByIdAndUpdate(artist._id, {
        $addToSet: { artworks: artwork._id },
      })
      .exec();

    return artwork;
  }
}
