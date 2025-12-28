import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Artist, ArtistDocument } from "../schemas/artists-profile.schema";
import { Model, Types } from "mongoose";
import { ArtistCreateDto } from "../dto/artist-create.dto";
import { User, UserDocument } from "../schemas/users.schema";
import { IUserStatus } from "../enums/users-status.enum";
import { IUserRoles } from "../enums/users-role.enum";

@Injectable()
export class CreateArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async execute(userId: string, dto: ArtistCreateDto): Promise<ArtistDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.userModel
      .findById(userObjectId)
      .select("role status")
      .exec();

    if (!user || user.status !== IUserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }

    const existingArtist = await this.artistModel
      .findOne({
        userId: userObjectId,
      })
      .exec();

    if (existingArtist) {
      return existingArtist;
    }

    const artist = await this.artistModel.create({
      userId: userObjectId,
      displayName: dto.displayName?.trim(),
      techniques: dto.techniques ?? [],
      styles: dto?.styles ?? [],
    });

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
