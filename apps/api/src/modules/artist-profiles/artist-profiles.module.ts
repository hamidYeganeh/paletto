import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistProfile, ArtistProfileSchema } from './schemas/artist-profile.schema';
import { ArtistProfilesService } from './artist-profiles.service';
import { ArtistProfilesController } from './artist-profiles.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ArtistProfile.name, schema: ArtistProfileSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [ArtistProfilesController],
  providers: [ArtistProfilesService],
  exports: [ArtistProfilesService],
})
export class ArtistProfilesModule {}
