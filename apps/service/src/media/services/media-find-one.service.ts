import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Media, MediaDocument } from "../schemas/media.schema";

@Injectable()
export class MediaFindOneService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>
  ) {}

  async execute(mediaId: string): Promise<MediaDocument> {
    if (!Types.ObjectId.isValid(mediaId)) {
      throw new NotFoundException("Invalid media id");
    }

    try {
      const media = await this.mediaModel.findById(mediaId).exec();
      if (!media) {
        throw new NotFoundException("Media not found");
      }
      return media;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to load media");
    }
  }
}

