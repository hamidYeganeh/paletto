import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream } from "fs";
import { constants as fsConstants } from "fs";
import { access, readdir } from "fs/promises";
import { extname, join, resolve } from "path";

@Injectable()
export class GetMediaService {
  private readonly uploadDir = resolve(process.cwd(), "storage", "media");
  private readonly hashPattern = /^[a-fA-F0-9]{64}(?:\.[a-zA-Z0-9]+)?$/;

  private async resolveFileName(hash: string): Promise<string> {
    if (!this.hashPattern.test(hash)) {
      throw new BadRequestException("Invalid media hash");
    }

    const baseHash = hash.split(".")[0];
    const directPath = join(this.uploadDir, hash);
    try {
      await access(directPath, fsConstants.R_OK);
      return hash;
    } catch {
      // continue searching
    }

    let files: string[];
    try {
      files = await readdir(this.uploadDir);
    } catch {
      throw new NotFoundException("Media not found");
    }

    const match = files.find((file) => {
      if (file.endsWith(".json")) return false;
      return file.startsWith(baseHash);
    });

    if (!match) {
      throw new NotFoundException("Media not found");
    }

    return match;
  }

  async execute(hash: string): Promise<StreamableFile> {
    const fileName = await this.resolveFileName(hash);
    const filePath = join(this.uploadDir, fileName);
    const ext = extname(fileName).toLowerCase().replace(".", "");
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      pdf: "application/pdf",
    };
    const mimeType = mimeMap[ext];
    const dispositionName = fileName;

    return new StreamableFile(createReadStream(filePath), {
      type: mimeType,
      disposition: `inline; filename="${dispositionName}"`,
    });
  }
}
