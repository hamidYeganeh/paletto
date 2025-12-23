import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserRoles } from "src/users/enums/users-roles.enum";
import { ArtworkUpdateDto } from "../dto/artworks-update.dto";
import { ArtworksStatus } from "../enums/artworks-status.enum";
import { Artwork, ArtworkDocument } from "../schemas/artwork.schema";

type Actor = { id: string; role?: string };

@Injectable()
export class ArtworksUpdateService {
  constructor(
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  private toObjectIdArray(ids: string[]): Types.ObjectId[] {
    const invalid = ids.find((id) => !Types.ObjectId.isValid(id));
    if (invalid) {
      throw new BadRequestException(`Invalid id: ${invalid}`);
    }
    return ids.map((id) => new Types.ObjectId(id));
  }

  async execute(actor: Actor, dto: ArtworkUpdateDto): Promise<ArtworkDocument> {
    if (!Types.ObjectId.isValid(dto.artworkID)) {
      throw new NotFoundException("Invalid artwork id");
    }

    const isAdmin = actor.role === UserRoles.ADMIN;
    const isArtist = actor.role === UserRoles.ARTIST;

    if (!isAdmin && !isArtist) {
      throw new ForbiddenException("Only artist or admin can update an artwork");
    }

    try {
      const existingArtwork = await this.artworkModel
        .findById(dto.artworkID)
        .select({ artistID: 1, status: 1 })
        .exec();

      if (!existingArtwork) {
        throw new NotFoundException("Artwork not found");
      }

      const isOwner = String(existingArtwork.artistID) === String(actor.id);

      if (!isAdmin && !isOwner) {
        throw new ForbiddenException("You can only update your own artwork");
      }

      const updateFields: Record<string, unknown> = {};

      if (dto.title !== undefined) updateFields.title = dto.title;
      if (dto.description !== undefined) updateFields.description = dto.description;
      if (dto.price !== undefined) updateFields.price = dto.price;
      if (dto.currency !== undefined) updateFields.currency = dto.currency;
      if (dto.isNegotiable !== undefined) updateFields.isNegotiable = dto.isNegotiable;
      if (dto.year !== undefined) updateFields.year = dto.year;
      if (dto.widthCm !== undefined) updateFields.widthCm = dto.widthCm;
      if (dto.heightCm !== undefined) updateFields.heightCm = dto.heightCm;
      if (dto.depthCm !== undefined) updateFields.depthCm = dto.depthCm;
      if (dto.tags !== undefined) updateFields.tags = dto.tags;
      if (dto.images !== undefined) updateFields.images = dto.images;

      if (dto.categories !== undefined) {
        updateFields.categories = this.toObjectIdArray(dto.categories);
      }
      if (dto.techniques !== undefined) {
        updateFields.techniques = this.toObjectIdArray(dto.techniques);
      }
      if (dto.materials !== undefined) {
        updateFields.materials = this.toObjectIdArray(dto.materials);
      }
      if (dto.mediums !== undefined) {
        updateFields.mediums = this.toObjectIdArray(dto.mediums);
      }

      if (dto.status !== undefined) {
        updateFields.status = dto.status;
        if (dto.status === ArtworksStatus.SOLD && !existingArtwork.soldAt) {
          updateFields.soldAt = new Date();
        }
      }

      if (Object.keys(updateFields).length === 0) {
        throw new BadRequestException("No fields to update");
      }

      const updatedArtwork = await this.artworkModel
        .findByIdAndUpdate(
          dto.artworkID,
          { $set: updateFields },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedArtwork) {
        throw new NotFoundException("Artwork not found");
      }

      return updatedArtwork;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to update artwork");
    }
  }
}
