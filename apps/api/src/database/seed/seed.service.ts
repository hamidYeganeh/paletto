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

    const admin = await this.usersService.createUser('09000000000', UserRole.ADMIN, 'مدیر پالتو');
    const artist = await this.usersService.createUser('09120000001', UserRole.ARTIST, 'نگار جلالی');

    await this.artistProfilesService.upsert(artist._id.toString(), {
      displayName: 'نگار جلالی',
      bio: 'نقاش معاصر تهرانی؛ آثار رنگ روغن و ترکیب‌مواد.',
      location: 'تهران، ایران',
    });

    const artworkSeeds: CreateArtworkDto[] = [
      {
        title: 'غروب روی تپه‌ها',
        description: 'رنگ روغن روی بوم؛ لحظه طلایی غروب بر تپه‌های خشک.',
        medium: ArtworkMedium.PAINTING,
        price: 45000000,
        currency: 'IRR',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200'],
        year: 2023,
      },
      {
        title: 'بازتاب شهری',
        description: 'ترکیب مواد؛ بازتاب شهر در شیشه و فلز.',
        medium: ArtworkMedium.MIXED_MEDIA,
        price: 32000000,
        currency: 'IRR',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200'],
        year: 2024,
      },
      {
        title: 'پرتره خاموش',
        description: 'مطالعه پرتره با زغال روی کاغذ.',
        medium: ArtworkMedium.ILLUSTRATION,
        price: 18000000,
        currency: 'IRR',
        images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200'],
        year: 2024,
      },
    ];

    const createdArtworks: ArtworkDocument[] = [];
    for (const artworkDto of artworkSeeds) {
      const artwork = await this.artworksService.create(artist._id.toString(), artworkDto);
      createdArtworks.push(artwork);
    }

    await this.exhibitionsService.create({
      title: 'سالن افتتاحیه',
      slug: 'opening-hall',
      description: 'اولین نمایشگاه مجازی پالتو با آثار منتخب هنرمندان بنیان‌گذار.',
      artworkIds: createdArtworks.map((artwork) => artwork._id.toString()),
      status: ExhibitionStatus.OPEN,
      startDate: new Date().toISOString(),
    });

    this.logger.log(
      `Seed complete: admin=${admin.phone}, artist=${artist.phone}, artworks=${createdArtworks.length}, exhibition=opening-hall`,
    );
  }
}
