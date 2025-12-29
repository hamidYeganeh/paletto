import { Injectable, StreamableFile } from "@nestjs/common";
import type { Express } from "express";
import { GetMediaService } from "./services/get-media.service";
import {
  UploadMediaResponse,
  UploadMediaService,
} from "./services/upload-media.service";

@Injectable()
export class MediaService {
  constructor(
    private readonly uploadMediaService: UploadMediaService,
    private readonly getMediaService: GetMediaService
  ) {}

  async upload(file?: Express.Multer.File): Promise<UploadMediaResponse> {
    return this.uploadMediaService.execute(file);
  }

  async get(hash: string): Promise<StreamableFile> {
    return this.getMediaService.execute(hash);
  }
}
