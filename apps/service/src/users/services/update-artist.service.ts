import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Artist, ArtistDocument } from "../schemas/artists-profile.schema";
import { Model, Types } from "mongoose";
import { ArtistUpdateDto } from "../dto/artist-update.dto";
import { User, UserDocument } from "../schemas/users.schema";
import { IUserStatus } from "../enums/users-status.enum";
import { IUserRoles } from "../enums/users-role.enum";

@Injectable()
export class UpdateArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async execute(
    userId: string,
    dto: ArtistUpdateDto
  ): Promise<ArtistDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.userModel
      .findById(userObjectId)
      .select("role status")
      .exec();

    if (!user || user.status !== IUserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }

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
        { new: true, upsert: true }
      )
      .exec();

    if (user.role !== IUserRoles.ARTIST) {
      await this.userModel
        .findByIdAndUpdate(
          { _id: userObjectId },
          { $set: { role: IUserRoles.ARTIST } }
        )
        .exec();
    }

    return artist;
  }
}
