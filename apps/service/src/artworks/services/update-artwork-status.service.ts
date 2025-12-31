import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateArtworkStatusDto } from "../dto/update-artwork-status.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";

@Injectable()
export class UpdateArtworkStatusService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(dto: UpdateArtworkStatusDto): Promise<ArtworkDocument> {
    const artworkId = dto.artworkId?.trim();
    if (!artworkId || !Types.ObjectId.isValid(artworkId)) {
      throw new BadRequestException("Invalid artwork id");
    }

    const artwork = await this.artworkModel
      .findByIdAndUpdate(
        artworkId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!artwork) {
      throw new NotFoundException("Artwork not found");
    }

    return artwork;
  }
}
