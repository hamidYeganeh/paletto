import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArtistProfilesModule } from './modules/artist-profiles/artist-profiles.module';
import { ArtworksModule } from './modules/artworks/artworks.module';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { ExhibitionsModule } from './modules/exhibitions/exhibitions.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { SocialModule } from './modules/social/social.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MediaModule } from './modules/media/media.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedModule } from './database/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    RedisModule,

    HealthModule,
    AuthModule,
    UsersModule,
    ArtistProfilesModule,
    ArtworksModule,
    TaxonomyModule,
    ExhibitionsModule,
    OrdersModule,
    CommissionsModule,
    CollectionsModule,
    SocialModule,
    NotificationsModule,
    MediaModule,
    ReviewsModule,
    ReportsModule,
    AdminModule,

    SeedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
