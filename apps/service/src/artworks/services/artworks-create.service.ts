import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserRoles } from "src/users/enums/users-roles.enum";
import { ArtworkCreateDto } from "../dto/artworks-create.dto";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";

type Actor = { id: string; role?: string };

@Injectable()
export class ArtworksCreateService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async execute(actor: Actor, dto: ArtworkCreateDto): Promise<ArtworkDocument> {
    const isAdmin = actor.role === UserRoles.ADMIN;
    const isArtist = actor.role === UserRoles.ARTIST;

    if (!isAdmin && !isArtist) {
      throw new ForbiddenException("Only artist or admin can create an artwork");
    }

    const artistID = isAdmin ? dto.artistID : actor.id;

    if (isAdmin && !artistID) {
      throw new BadRequestException("artistID is required for admin");
    }

    if (!artistID || !Types.ObjectId.isValid(artistID)) {
      throw new BadRequestException("Invalid artist id");
    }

    try {
      const artistObjectId = new Types.ObjectId(artistID);
      const categories = (dto.categories ?? []).map((id) => new Types.ObjectId(id));
      const techniques = (dto.techniques ?? []).map((id) => new Types.ObjectId(id));
      const materials = (dto.materials ?? []).map((id) => new Types.ObjectId(id));
      const mediums = (dto.mediums ?? []).map((id) => new Types.ObjectId(id));

      const created = await this.artworkModel.create({
        title: dto.title,
        description: dto.description,
        artistID: artistObjectId,
        categories,
        techniques,
        materials,
        mediums,
        tags: dto.tags ?? [],
        images: dto.images ?? [],
        year: dto.year,
        widthCm: dto.widthCm,
        heightCm: dto.heightCm,
        depthCm: dto.depthCm,
        price: dto.price,
        currency: dto.currency,
        isNegotiable: dto.isNegotiable,
        status: dto.status,
      });

      return created;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to create artwork");
    }
  }
}
