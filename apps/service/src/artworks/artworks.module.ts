import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArtworksController } from "./controllers/artworks.controller";
import { ArtworksAdminController } from "./controllers/artworks-admin.controller";
import { ArtworksService } from "./artworks.service";
import { Artwork, ArtworkSchema } from "./schemas/artwork.schema";
import { UsersModule } from "src/users/users.module";
import { CreateArtworkService } from "./services/create-artwork.service";
import { GetArtworkService } from "./services/get-artwork.service";
import { ListArtworksService } from "./services/list-artworks.service";
import { UpdateArtworkService } from "./services/update-artwork.service";
import { UpdateArtworkStatusService } from "./services/update-artwork-status.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
    ]),
  ],
  controllers: [ArtworksController, ArtworksAdminController],
  providers: [
    ArtworksService,
    CreateArtworkService,
    GetArtworkService,
    ListArtworksService,
    UpdateArtworkService,
    UpdateArtworkStatusService,
  ],
})
export class ArtworksModule {}
