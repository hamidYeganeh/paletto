import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArtworksController } from "./artworks.controller";
import { ArtworksService } from "./artworks.service";
import { Artwork, ArtworkSchema } from "./schemas/artwork.schema";
import { Artist, ArtistSchema } from "src/users/schemas/artists-profile.schema";
import { UsersModule } from "src/users/users.module";
import { CreateArtworkService } from "./services/create-artwork.service";
import { ListArtworksService } from "./services/list-artworks.service";
import { UpdateArtworkService } from "./services/update-artwork.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
  controllers: [ArtworksController],
  providers: [
    ArtworksService,
    CreateArtworkService,
    ListArtworksService,
    UpdateArtworkService,
  ],
})
export class ArtworksModule {}
