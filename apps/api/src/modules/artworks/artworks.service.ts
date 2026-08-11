import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { ArtworkDto, ArtworkStatus } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Artwork, ArtworkDocument } from './schemas/artwork.schema';
import { WishlistItem, WishlistItemDocument } from './schemas/wishlist-item.schema';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { ArtworkQueryDto } from './dto/artwork-query.dto';

@Injectable()
export class ArtworksService {
  constructor(
    @InjectModel(Artwork.name) private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(WishlistItem.name) private readonly wishlistModel: Model<WishlistItemDocument>,
  ) {}

  async findAll(query: ArtworkQueryDto) {
    const { page, limit, skip } = parsePagination(query.page, query.limit);
    const filter: QueryFilter<ArtworkDocument> = {
      status: query.status ?? ArtworkStatus.PUBLISHED,
    };

    if (query.artistId && Types.ObjectId.isValid(query.artistId)) {
      filter.artistId = new Types.ObjectId(query.artistId);
    }
    if (query.categoryId && Types.ObjectId.isValid(query.categoryId)) {
      filter.categoryIds = new Types.ObjectId(query.categoryId);
    }
    if (query.tagId && Types.ObjectId.isValid(query.tagId)) {
      filter.tagIds = new Types.ObjectId(query.tagId);
    }
    if (query.minPrice != null || query.maxPrice != null) {
      filter.price = {};
      if (query.minPrice != null) filter.price.$gte = query.minPrice;
      if (query.maxPrice != null) filter.price.$lte = query.maxPrice;
    }
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const [items, total] = await Promise.all([
      this.artworkModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.artworkModel.countDocuments(filter).exec(),
    ]);

    return { items: items.map((item) => this.toDto(item)), total, page, limit };
  }

  async findById(id: string): Promise<ArtworkDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.artworkModel.findById(id).exec();
  }

  async findByIdOrThrow(id: string): Promise<ArtworkDocument> {
    const artwork = await this.findById(id);
    if (!artwork) throw new NotFoundException('Artwork not found');
    return artwork;
  }

  async incrementViews(id: string): Promise<void> {
    await this.artworkModel.updateOne({ _id: id }, { $inc: { viewsCount: 1 } }).exec();
  }

  async create(artistId: string, dto: CreateArtworkDto): Promise<ArtworkDocument> {
    const created = new this.artworkModel({
      artistId: new Types.ObjectId(artistId),
      title: dto.title,
      description: dto.description,
      medium: dto.medium,
      price: dto.price,
      currency: dto.currency ?? 'IRR',
      images: dto.images,
      categoryIds: (dto.categoryIds ?? []).filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id)),
      tagIds: (dto.tagIds ?? []).filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id)),
      width: dto.width,
      height: dto.height,
      depth: dto.depth,
      year: dto.year,
      isFramed: dto.isFramed ?? false,
      status: ArtworkStatus.PUBLISHED,
    });
    return created.save();
  }

  async update(id: string, requesterId: string, isAdmin: boolean, dto: UpdateArtworkDto): Promise<ArtworkDocument> {
    const artwork = await this.findByIdOrThrow(id);
    if (!isAdmin && artwork.artistId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this artwork');
    }

    Object.assign(artwork, {
      ...dto,
      categoryIds: dto.categoryIds
        ? dto.categoryIds.filter((cid) => Types.ObjectId.isValid(cid)).map((cid) => new Types.ObjectId(cid))
        : artwork.categoryIds,
      tagIds: dto.tagIds
        ? dto.tagIds.filter((tid) => Types.ObjectId.isValid(tid)).map((tid) => new Types.ObjectId(tid))
        : artwork.tagIds,
    });

    return artwork.save();
  }

  async remove(id: string, requesterId: string, isAdmin: boolean): Promise<void> {
    const artwork = await this.findByIdOrThrow(id);
    if (!isAdmin && artwork.artistId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this artwork');
    }
    await artwork.deleteOne();
  }

  async addToWishlist(userId: string, artworkId: string): Promise<void> {
    await this.findByIdOrThrow(artworkId);
    await this.wishlistModel
      .updateOne(
        { userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) },
        { $setOnInsert: { userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) } },
        { upsert: true },
      )
      .exec();
  }

  async removeFromWishlist(userId: string, artworkId: string): Promise<void> {
    await this.wishlistModel
      .deleteOne({ userId: new Types.ObjectId(userId), artworkId: new Types.ObjectId(artworkId) })
      .exec();
  }

  async listWishlist(userId: string): Promise<ArtworkDto[]> {
    const items = await this.wishlistModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
    const artworkIds = items.map((item) => item.artworkId);
    const artworks = await this.artworkModel.find({ _id: { $in: artworkIds } }).exec();
    return artworks.map((artwork) => this.toDto(artwork));
  }

  async count(filter: QueryFilter<ArtworkDocument> = {}): Promise<number> {
    return this.artworkModel.countDocuments(filter).exec();
  }

  toDto(artwork: ArtworkDocument): ArtworkDto {
    return {
      id: artwork._id.toString(),
      artistId: artwork.artistId.toString(),
      title: artwork.title,
      description: artwork.description,
      medium: artwork.medium,
      price: artwork.price,
      currency: artwork.currency,
      status: artwork.status,
      images: artwork.images,
      categoryIds: artwork.categoryIds.map((id) => id.toString()),
      tagIds: artwork.tagIds.map((id) => id.toString()),
      width: artwork.width,
      height: artwork.height,
      depth: artwork.depth,
      year: artwork.year,
      isFramed: artwork.isFramed,
      likesCount: artwork.likesCount,
      viewsCount: artwork.viewsCount,
      createdAt: (artwork.createdAt ?? new Date()).toISOString(),
      updatedAt: (artwork.updatedAt ?? new Date()).toISOString(),
    };
  }
}
