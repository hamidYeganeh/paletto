import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArtistProfileDto } from '@workspace/shared';
import { slugify } from '../../common/utils/slugify.util';
import { parsePagination } from '../../common/utils/pagination.util';
import { ArtistProfile, ArtistProfileDocument } from './schemas/artist-profile.schema';
import { UpsertArtistProfileDto } from './dto/upsert-artist-profile.dto';

@Injectable()
export class ArtistProfilesService {
  constructor(
    @InjectModel(ArtistProfile.name) private readonly artistProfileModel: Model<ArtistProfileDocument>,
  ) {}

  async findByUserId(userId: string): Promise<ArtistProfileDocument | null> {
    return this.artistProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findBySlug(slug: string): Promise<ArtistProfileDocument | null> {
    return this.artistProfileModel.findOne({ slug }).exec();
  }

  async findById(id: string): Promise<ArtistProfileDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.artistProfileModel.findById(id).exec();
  }

  async findAll(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const [items, total] = await Promise.all([
      this.artistProfileModel.find().sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.artistProfileModel.countDocuments().exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async upsert(userId: string, dto: UpsertArtistProfileDto): Promise<ArtistProfileDocument> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      existing.displayName = dto.displayName;
      existing.bio = dto.bio;
      existing.coverImageUrl = dto.coverImageUrl;
      existing.location = dto.location;
      existing.socialLinks = dto.socialLinks;
      return existing.save();
    }

    const slug = await this.generateUniqueSlug(dto.displayName);
    const created = new this.artistProfileModel({
      userId: new Types.ObjectId(userId),
      displayName: dto.displayName,
      slug,
      bio: dto.bio,
      coverImageUrl: dto.coverImageUrl,
      location: dto.location,
      socialLinks: dto.socialLinks ?? {},
    });
    return created.save();
  }

  private async generateUniqueSlug(displayName: string): Promise<string> {
    const base = slugify(displayName) || 'artist';
    let candidate = base;
    let suffix = 1;
    while (await this.artistProfileModel.exists({ slug: candidate })) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  async incrementFollowersCount(artistUserId: string, delta: number): Promise<void> {
    await this.artistProfileModel
      .updateOne({ userId: new Types.ObjectId(artistUserId) }, { $inc: { followersCount: delta } })
      .exec();
  }

  toDto(profile: ArtistProfileDocument): ArtistProfileDto {
    return {
      id: profile._id.toString(),
      userId: profile.userId.toString(),
      displayName: profile.displayName,
      slug: profile.slug,
      bio: profile.bio,
      coverImageUrl: profile.coverImageUrl,
      location: profile.location,
      socialLinks: profile.socialLinks,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      isVerified: profile.isVerified,
      createdAt: (profile.createdAt ?? new Date()).toISOString(),
      updatedAt: (profile.updatedAt ?? new Date()).toISOString(),
    };
  }
}
