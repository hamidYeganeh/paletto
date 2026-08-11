import { Body, Controller, Post } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { MediaType } from '@workspace/shared';

class UploadStubDto {
  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}

/**
 * Media module stub. In production this would proxy to an object storage
 * provider (S3/GCS/Cloudinary). For now it returns a deterministic mock URL
 * so the rest of the platform can be built against a stable contract.
 */
@Controller('media')
export class MediaController {
  @Post('upload')
  upload(@Body() dto: UploadStubDto) {
    const id = uuid();
    const filename = dto.filename ?? `${id}.bin`;
    return {
      id,
      type: MediaType.IMAGE,
      url: `https://cdn.paletto.local/mock/${id}/${filename}`,
      mimeType: dto.mimeType ?? 'application/octet-stream',
      createdAt: new Date().toISOString(),
    };
  }
}
