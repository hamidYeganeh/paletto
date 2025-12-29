import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { GetMediaService } from "./services/get-media.service";
import { UploadMediaService } from "./services/upload-media.service";
import { MediaService } from "./media.service";

@Module({
  controllers: [MediaController],
  providers: [MediaService, UploadMediaService, GetMediaService],
})
export class MediaModule {}
