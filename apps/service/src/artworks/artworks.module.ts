import { Module } from "@nestjs/common";
import { ArtworksController } from "./artworks.controller";
import { ArtworksService } from "./artworks.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Artwork, ArtworkSchema } from "./schemas/artwork.schema";
import { ArtworksCreateService } from "./services/artworks-create.service";
import { ArtworksListService } from "./services/artworks-list.service";
import { ArtworksUpdateService } from "./services/artworks-update.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
    ]),
  ],
  controllers: [ArtworksController],
  providers: [
    ArtworksService,
    ArtworksCreateService,
    ArtworksListService,
    ArtworksUpdateService,
  ],
})
export class ArtworksModule {}
