import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Artist, ArtistDocument } from "../schemas/artists-profile.schema";
import { Model, Types } from "mongoose";
import { ArtistUpdateDto } from "../dto/artist-update.dto";
import { ArtistAccessService } from "./artist-access.service";

@Injectable()
export class UpdateArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly artistAccessService: ArtistAccessService
  ) {}

  async execute(
    userId: string,
    dto: ArtistUpdateDto
  ): Promise<ArtistDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.artistAccessService.ensureActiveUser(userObjectId);

    const updatePayload: Partial<Artist> = {};

    if (dto.displayName !== undefined) {
      updatePayload.displayName = dto.displayName?.trim();
    }

    if (dto.techniques !== undefined) {
      updatePayload.techniques = dto.techniques;
    }

    if (dto.styles !== undefined) {
      updatePayload.styles = dto.styles;
    }

    const artist = await this.artistModel
      .findOneAndUpdate(
        { userId: userObjectId },
        {
          $set: updatePayload,
          $setOnInsert: { userId: userObjectId },
        },
        { new: true, upsert: true, runValidators: true }
      )
      .exec();

    await this.artistAccessService.ensureArtistRole(userObjectId, user.role);

    return artist;
  }
}
