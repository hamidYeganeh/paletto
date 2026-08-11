import { Module } from '@nestjs/common';
import { UsersModule } from '../../modules/users/users.module';
import { ArtistProfilesModule } from '../../modules/artist-profiles/artist-profiles.module';
import { ArtworksModule } from '../../modules/artworks/artworks.module';
import { ExhibitionsModule } from '../../modules/exhibitions/exhibitions.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, ArtistProfilesModule, ArtworksModule, ExhibitionsModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
