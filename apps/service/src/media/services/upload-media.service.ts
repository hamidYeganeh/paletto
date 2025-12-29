import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";
import type { Express } from "express";

export interface UploadMediaResponse {
  hash: string;
  fileName: string;
  url: string;
}

@Injectable()
export class UploadMediaService {
  private readonly logger = new Logger(UploadMediaService.name);
  private readonly uploadDir = resolve(process.cwd(), "storage", "media");

  async execute(file?: Express.Multer.File): Promise<UploadMediaResponse> {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const hash = createHash("sha256").update(file.buffer).digest("hex");
    const extension = extname(file.originalname || "")
      .replace(/[^a-zA-Z0-9.]/g, "")
      .toLowerCase();
    const fileName = extension ? `${hash}${extension}` : hash;
    const filePath = resolve(this.uploadDir, fileName);

    await mkdir(this.uploadDir, { recursive: true });
    await writeFile(filePath, file.buffer);

    this.logger.log(`Stored media ${fileName} (${file.size} bytes)`);

    return {
      hash,
      fileName,
      url: `/media/${fileName}`,
    };
  }
}
