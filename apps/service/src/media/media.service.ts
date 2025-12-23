import { Injectable } from "@nestjs/common";
import { MediaDocument } from "./schemas/media.schema";
import { MediaFindByHashService } from "./services/media-find-by-hash.service";
import { MediaFindOneService } from "./services/media-find-one.service";
import { MediaUploadService } from "./services/media-upload.service";

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaUploadService: MediaUploadService,
    private readonly mediaFindOneService: MediaFindOneService,
    private readonly mediaFindByHashService: MediaFindByHashService
  ) {}

  async upload(file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }): Promise<MediaDocument> {
    return this.mediaUploadService.execute(file);
  }

  async getById(mediaId: string): Promise<MediaDocument> {
    return this.mediaFindOneService.execute(mediaId);
  }

  async getByHash(hash: string): Promise<MediaDocument> {
    return this.mediaFindByHashService.execute(hash);
  }
}
