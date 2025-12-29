import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { GetMediaService } from "./services/get-media.service";
import { UploadMediaService } from "./services/upload-media.service";

@Module({
  controllers: [MediaController],
  providers: [UploadMediaService, GetMediaService],
})
export class MediaModule {}
