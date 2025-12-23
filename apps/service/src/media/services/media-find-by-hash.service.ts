import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Media, MediaDocument } from "../schemas/media.schema";

@Injectable()
export class MediaFindByHashService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>
  ) {}

  async execute(hash: string): Promise<MediaDocument> {
    const normalized = String(hash || "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(normalized)) {
      throw new NotFoundException("Invalid media hash");
    }

    try {
      const media = await this.mediaModel.findOne({ hash: normalized }).exec();
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

