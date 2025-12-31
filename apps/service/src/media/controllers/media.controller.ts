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
import { MediaService } from "../media.service";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Get(":hash")
  async getMedia(@Param("hash") hash: string) {
    return this.mediaService.get(hash);
  }
}
