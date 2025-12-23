import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import fs from "fs";
import path from "path";
import { ConfigService } from "@nestjs/config";
import { MediaService } from "./media.service";

@Controller("media")
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile()
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number }
  ) {
    const media = await this.mediaService.upload(file);
    return {
      id: media._id,
      hash: media.hash,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: `/media/file/${media.hash}`,
    };
  }

  @Get(":mediaId")
  async getById(@Param("mediaId") mediaId: string) {
    const media = await this.mediaService.getById(mediaId);
    return {
      id: media._id,
      hash: media.hash,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: `/media/file/${media.hash}`,
      createdAt: media.createdAt,
    };
  }

  @Get("hash/:hash")
  async getByHash(@Param("hash") hash: string) {
    const media = await this.mediaService.getByHash(hash);
    return {
      id: media._id,
      hash: media.hash,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: `/media/file/${media.hash}`,
      createdAt: media.createdAt,
    };
  }

  @Get("file/:hash")
  async getFile(@Param("hash") hash: string, @Res() res: Response) {
    const media = await this.mediaService.getByHash(hash);

    const storageDir =
      this.configService.get<string>("MEDIA_STORAGE_DIR")?.trim() ||
      "storage/media";
    const absolutePath = path.resolve(process.cwd(), storageDir, media.relativePath);

    if (!fs.existsSync(absolutePath)) {
      res.status(404).json({ message: "File not found on disk" });
      return;
    }

    res.setHeader("content-type", media.mimeType);
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
    res.sendFile(absolutePath);
  }
}
