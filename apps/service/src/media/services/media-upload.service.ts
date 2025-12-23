import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { Media, MediaDocument } from "../schemas/media.schema";

function ensureDirSync(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeExtname(originalName: string): string {
  const ext = path.extname(originalName || "").toLowerCase();
  if (!ext) return "";
  if (ext.length > 10) return "";
  if (!/^\.[a-z0-9]+$/.test(ext)) return "";
  return ext;
}

@Injectable()
export class MediaUploadService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
    private readonly configService: ConfigService
  ) {}

  private getStorageRoot(): string {
    const configured = this.configService.get<string>("MEDIA_STORAGE_DIR");
    const relative = configured && configured.trim() ? configured.trim() : "storage/media";
    return path.resolve(process.cwd(), relative);
  }

  async execute(file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }): Promise<MediaDocument> {
    if (!file) {
      throw new NotFoundException("File is required");
    }

    try {
      const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

      const existing = await this.mediaModel.findOne({ hash }).exec();
      if (existing) {
        return existing;
      }

      const storageRoot = this.getStorageRoot();
      ensureDirSync(storageRoot);

      const ext = safeExtname(file.originalname);
      const filename = `${hash}${ext}`;
      const absolutePath = path.join(storageRoot, filename);

      fs.writeFileSync(absolutePath, file.buffer);

      const created = await this.mediaModel.create({
        hash,
        originalName: file.originalname,
        filename,
        mimeType: file.mimetype,
        size: file.size,
        relativePath: filename,
      });

      return created;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to upload media");
    }
  }
}
