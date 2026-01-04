import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";
import { UpdateArtworkDto } from "../dto/update-artwork.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";
import {
  Artist,
  ArtistDocument,
} from "src/users/schemas/artists-profile.schema";
import { ArtistAccessService } from "src/users/services/artist-access.service";
import { normalizeImages } from "../utils/normalize-images";
import { normalizeTags } from "src/common/tags";

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
    const unsetPayload: Record<string, "" | 1> = {};

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

    if (dto.tags !== undefined) {
      updatePayload.tags = normalizeTags(dto.tags);
    }

    if (dto.isScheduled !== undefined || dto.publishAt !== undefined) {
      const scheduleUpdate = this.resolveScheduleUpdate(
        dto.isScheduled,
        dto.publishAt
      );
      Object.assign(updatePayload, scheduleUpdate.set);
      Object.assign(unsetPayload, scheduleUpdate.unset);
    }

    const artworkObjectId = new Types.ObjectId(artworkId);

    const updateQuery: UpdateQuery<Artwork> = { $set: updatePayload };
    if (Object.keys(unsetPayload).length) {
      updateQuery.$unset = unsetPayload;
    }

    const artwork = await this.artworkModel
      .findOneAndUpdate(
        { _id: artworkObjectId, artistId: artist._id },
        updateQuery,
        { new: true, runValidators: true }
      )
      .exec();

    if (!artwork) {
      throw new NotFoundException("Artwork not found");
    }

    return artwork;
  }

  private resolveScheduleUpdate(
    isScheduled?: boolean,
    publishAt?: string
  ): { set: Partial<Artwork>; unset: Record<string, "" | 1> } {
    const set: Partial<Artwork> = {};
    const unset: Record<string, "" | 1> = {};
    const hasPublishAt = publishAt !== undefined;

    if (isScheduled === true && !publishAt) {
      throw new BadRequestException(
        "publishAt is required when isScheduled is true"
      );
    }

    if (isScheduled === false && hasPublishAt) {
      throw new BadRequestException(
        "publishAt requires isScheduled to be true"
      );
    }

    if (hasPublishAt) {
      const publishAtDate = new Date(publishAt);
      if (Number.isNaN(publishAtDate.getTime())) {
        throw new BadRequestException("Invalid publishAt value");
      }
      set.publishAt = publishAtDate;
      if (isScheduled === undefined) {
        set.isScheduled = true;
      }
    }

    if (isScheduled !== undefined) {
      set.isScheduled = isScheduled;
      if (!isScheduled) {
        unset.publishAt = "";
      }
    }

    return { set, unset };
  }
}
