import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Artist, ArtistDocument } from "../schemas/artists-profile.schema";
import { Model, Types } from "mongoose";
import { ArtistCreateDto } from "../dto/artist-create.dto";
import { ArtistAccessService } from "./artist-access.service";

@Injectable()
export class CreateArtistService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    private readonly artistAccessService: ArtistAccessService
  ) {}

  async execute(userId: string, dto: ArtistCreateDto): Promise<ArtistDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.artistAccessService.ensureActiveUser(userObjectId);

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

    await this.artistAccessService.ensureArtistRole(userObjectId, user.role);

    return artist;
  }
}
