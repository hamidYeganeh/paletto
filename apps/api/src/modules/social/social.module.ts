import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { ArtworksModule } from '../artworks/artworks.module';
import { ArtistProfilesModule } from '../artist-profiles/artist-profiles.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    ArtworksModule,
    ArtistProfilesModule,
    NotificationsModule,
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
