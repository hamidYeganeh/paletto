import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { Media, MediaSchema } from "./schemas/media.schema";
import { MediaFindByHashService } from "./services/media-find-by-hash.service";
import { MediaFindOneService } from "./services/media-find-one.service";
import { MediaUploadService } from "./services/media-upload.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaUploadService,
    MediaFindOneService,
    MediaFindByHashService,
  ],
})
export class MediaModule {}
