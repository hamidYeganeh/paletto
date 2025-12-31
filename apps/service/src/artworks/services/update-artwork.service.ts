import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateArtworkDto } from "../dto/update-artwork.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  Artist,
  ArtistDocument,
} from "src/users/schemas/artists-profile.schema";
import { ArtistAccessService } from "src/users/services/artist-access.service";
import { normalizeImages } from "../utils/normalize-images";

@Injectable()
export class UpdateArtworkService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly artistAccessService: ArtistAccessService
  ) {}

  async execute(userId: string, dto: UpdateArtworkDto): Promise<ArtworkDocument> {
    const artworkId = dto.artworkId?.trim();
    if (!artworkId || !Types.ObjectId.isValid(artworkId)) {
      throw new BadRequestException("Invalid artwork id");
    }

    const userObjectId = new Types.ObjectId(userId);

    await this.artistAccessService.ensureActiveUser(userObjectId);

    const artist = await this.artistModel
      .findOne({ userId: userObjectId })
      .select("_id")
      .lean()
      .exec();

    if (!artist) {
      throw new NotFoundException("Artist profile not found");
    }

    const updatePayload: Partial<Artwork> = {};

    if (dto.title !== undefined) {
      updatePayload.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      updatePayload.description = dto.description?.trim();
    }

    if (dto.images !== undefined) {
      updatePayload.images = normalizeImages(dto.images);
    }

    if (dto.techniques !== undefined) {
      updatePayload.techniques = dto.techniques;
    }

    if (dto.styles !== undefined) {
      updatePayload.styles = dto.styles;
    }

    if (dto.categories !== undefined) {
      updatePayload.categories = dto.categories;
    }

    const artworkObjectId = new Types.ObjectId(artworkId);

    const artwork = await this.artworkModel
      .findOneAndUpdate(
        { _id: artworkObjectId, artistId: artist._id },
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
      .exec();

    if (!artwork) {
      throw new NotFoundException("Artwork not found");
    }

    return artwork;
  }
}
