import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { type Express } from "express";
import { GetMediaService } from "./services/get-media.service";
import { UploadMediaService } from "./services/upload-media.service";

@Controller("media")
export class MediaController {
  constructor(
    private readonly uploadMediaService: UploadMediaService,
    private readonly getMediaService: GetMediaService
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    return this.uploadMediaService.execute(file);
  }

  @Get(":hash")
  async getMedia(@Param("hash") hash: string) {
    return this.getMediaService.execute(hash);
  }
}
