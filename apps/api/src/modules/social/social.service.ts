import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDto, FollowDto, LikeDto, NotificationType } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { ArtworksService } from '../artworks/artworks.service';
import { ArtistProfilesService } from '../artist-profiles/artist-profiles.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { Like, LikeDocument } from './schemas/like.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    private readonly artworksService: ArtworksService,
    private readonly artistProfilesService: ArtistProfilesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const created = await this.followModel
      .updateOne(
        { followerId: new Types.ObjectId(followerId), followingId: new Types.ObjectId(followingId) },
        {
          $setOnInsert: {
            followerId: new Types.ObjectId(followerId),
            followingId: new Types.ObjectId(followingId),
          },
        },
        { upsert: true },
      )
      .exec();

    if (created.upsertedCount > 0) {
      await this.artistProfilesService.incrementFollowersCount(followingId, 1);
      await this.notificationsService.create(
        followingId,
        NotificationType.SOCIAL_FOLLOW,
        'New follower',
        'Someone started following you',
      );
    }
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const deleted = await this.followModel
      .deleteOne({ followerId: new Types.ObjectId(followerId), followingId: new Types.ObjectId(followingId) })
      .exec();
    if (deleted.deletedCount > 0) {
      await this.artistProfilesService.incrementFollowersCount(followingId, -1);
    }
  }

  async listFollowers(userId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { followingId: new Types.ObjectId(userId) };
    const [items, total] = await Promise.all([
      this.followModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.followModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.followToDto(item)), total, page: p, limit: l };
  }

  async listFollowing(userId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { followerId: new Types.ObjectId(userId) };
    const [items, total] = await Promise.all([
      this.followModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.followModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.followToDto(item)), total, page: p, limit: l };
  }

  async like(userId: string, artworkId: string): Promise<void> {
    const artwork = await this.artworksService.findByIdOrThrow(artworkId);
    const created = await this.likeModel
      .updateOne(
        { userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) },
        { $setOnInsert: { userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) } },
        { upsert: true },
      )
      .exec();

    if (created.upsertedCount > 0) {
      artwork.likesCount += 1;
      await artwork.save();
      await this.notificationsService.create(
        artwork.artistId.toString(),
        NotificationType.SOCIAL_LIKE,
        'New like',
        `Someone liked your artwork "${artwork.title}"`,
      );
    }
  }

  async unlike(userId: string, artworkId: string): Promise<void> {
    const deleted = await this.likeModel
      .deleteOne({ userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) })
      .exec();
    if (deleted.deletedCount > 0) {
      const artwork = await this.artworksService.findByIdOrThrow(artworkId);
      artwork.likesCount = Math.max(0, artwork.likesCount - 1);
      await artwork.save();
    }
  }

  async addComment(userId: string, artworkId: string, dto: CreateCommentDto): Promise<CommentDocument> {
    const artwork = await this.artworksService.findByIdOrThrow(artworkId);
    const created = new this.commentModel({
      userId: new Types.ObjectId(userId),
      artworkId: new Types.ObjectId(artworkId),
      content: dto.content,
    });
    await created.save();

    await this.notificationsService.create(
      artwork.artistId.toString(),
      NotificationType.SOCIAL_COMMENT,
      'New comment',
      `Someone commented on your artwork "${artwork.title}"`,
    );

    return created;
  }

  async listComments(artworkId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { artworkId: new Types.ObjectId(artworkId) };
    const [items, total] = await Promise.all([
      this.commentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.commentModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.commentToDto(item)), total, page: p, limit: l };
  }

  followToDto(follow: FollowDocument): FollowDto {
    return {
      id: follow._id.toString(),
      followerId: follow.followerId.toString(),
      followingId: follow.followingId.toString(),
      createdAt: (follow.createdAt ?? new Date()).toISOString(),
    };
  }

  likeToDto(like: LikeDocument): LikeDto {
    return {
      id: like._id.toString(),
      userId: like.userId.toString(),
      artworkId: like.artworkId.toString(),
      createdAt: (like.createdAt ?? new Date()).toISOString(),
    };
  }

  commentToDto(comment: CommentDocument): CommentDto {
    return {
      id: comment._id.toString(),
      userId: comment.userId.toString(),
      artworkId: comment.artworkId.toString(),
      content: comment.content,
      createdAt: (comment.createdAt ?? new Date()).toISOString(),
    };
  }
}
