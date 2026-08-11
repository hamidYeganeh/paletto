import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ArtworkMedium, ExhibitionStatus, UserRole } from '@workspace/shared';
import { UsersService } from '../../modules/users/users.service';
import { ArtistProfilesService } from '../../modules/artist-profiles/artist-profiles.service';
import { ArtworksService } from '../../modules/artworks/artworks.service';
import { ArtworkDocument } from '../../modules/artworks/schemas/artwork.schema';
import { ExhibitionsService } from '../../modules/exhibitions/exhibitions.service';
import { CreateArtworkDto } from '../../modules/artworks/dto/create-artwork.dto';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly artistProfilesService: ArtistProfilesService,
    private readonly artworksService: ArtworksService,
    private readonly exhibitionsService: ExhibitionsService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedIfEmpty();
  }

  async seedIfEmpty(): Promise<void> {
    const existingUsers = await this.usersService.count();
    if (existingUsers > 0) {
      this.logger.log('Database already has data - skipping auto-seed.');
      return;
    }

    this.logger.log('Database is empty. Seeding initial data...');

    const admin = await this.usersService.createUser('09000000000', UserRole.ADMIN, 'Paletto Admin');
    const artist = await this.usersService.createUser('09120000001', UserRole.ARTIST, 'Sample Artist');

    await this.artistProfilesService.upsert(artist._id.toString(), {
      displayName: 'Sample Artist',
      bio: 'A featured artist on Paletto showcasing original works.',
      location: 'Tehran, Iran',
    });

    const artworkSeeds: CreateArtworkDto[] = [
      {
        title: 'Sunset over the Hills',
        description: 'An oil painting capturing a golden sunset over rolling hills.',
        medium: ArtworkMedium.PAINTING,
        price: 4500000,
        currency: 'IRR',
        images: ['https://picsum.photos/seed/paletto-1/800/600'],
        year: 2023,
      },
      {
        title: 'Urban Reflections',
        description: 'A mixed media piece exploring reflections in city glass.',
        medium: ArtworkMedium.MIXED_MEDIA,
        price: 3200000,
        currency: 'IRR',
        images: ['https://picsum.photos/seed/paletto-2/800/600'],
        year: 2024,
      },
      {
        title: 'Silent Portrait',
        description: 'A charcoal illustration portrait study.',
        medium: ArtworkMedium.ILLUSTRATION,
        price: 1800000,
        currency: 'IRR',
        images: ['https://picsum.photos/seed/paletto-3/800/600'],
        year: 2024,
      },
    ];

    const createdArtworks: ArtworkDocument[] = [];
    for (const artworkDto of artworkSeeds) {
      const artwork = await this.artworksService.create(artist._id.toString(), artworkDto);
      createdArtworks.push(artwork);
    }

    await this.exhibitionsService.create({
      title: 'Opening Hall',
      slug: 'opening-hall',
      description: 'The inaugural exhibition featuring hand-picked works from our founding artists.',
      artworkIds: createdArtworks.map((artwork) => artwork._id.toString()),
      status: ExhibitionStatus.OPEN,
      startDate: new Date().toISOString(),
    });

    this.logger.log(
      `Seed complete: admin=${admin.phone}, artist=${artist.phone}, artworks=${createdArtworks.length}, exhibition=opening-hall`,
    );
  }
}
