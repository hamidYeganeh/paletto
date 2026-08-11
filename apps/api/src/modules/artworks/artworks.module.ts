import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artwork, ArtworkSchema } from './schemas/artwork.schema';
import { WishlistItem, WishlistItemSchema } from './schemas/wishlist-item.schema';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Artwork.name, schema: ArtworkSchema },
      { name: WishlistItem.name, schema: WishlistItemSchema },
    ]),
  ],
  controllers: [ArtworksController],
  providers: [ArtworksService],
  exports: [ArtworksService],
})
export class ArtworksModule {}
