import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CollectionDto, CollectionVisibility } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(@InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>) {}

  async create(ownerId: string, dto: CreateCollectionDto): Promise<CollectionDocument> {
    const created = new this.collectionModel({
      ownerId: new Types.ObjectId(ownerId),
      name: dto.name,
      description: dto.description,
      visibility: dto.visibility ?? CollectionVisibility.PRIVATE,
    });
    return created.save();
  }

  async findForOwner(ownerId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { ownerId: new Types.ObjectId(ownerId) };
    const [items, total] = await Promise.all([
      this.collectionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.collectionModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async findPublic(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { visibility: CollectionVisibility.PUBLIC };
    const [items, total] = await Promise.all([
      this.collectionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.collectionModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async findByIdOrThrow(id: string): Promise<CollectionDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Collection not found');
    const collection = await this.collectionModel.findById(id).exec();
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(id: string, requesterId: string, dto: UpdateCollectionDto): Promise<CollectionDocument> {
    const collection = await this.findByIdOrThrow(id);
    if (collection.ownerId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this collection');
    }
    Object.assign(collection, dto);
    return collection.save();
  }

  async addArtwork(id: string, requesterId: string, artworkId: string): Promise<CollectionDocument> {
    const collection = await this.findByIdOrThrow(id);
    if (collection.ownerId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this collection');
    }
    const artworkObjectId = new Types.ObjectId(artworkId);
    if (!collection.artworkIds.some((existing) => existing.equals(artworkObjectId))) {
      collection.artworkIds.push(artworkObjectId);
      await collection.save();
    }
    return collection;
  }

  async removeArtwork(id: string, requesterId: string, artworkId: string): Promise<CollectionDocument> {
    const collection = await this.findByIdOrThrow(id);
    if (collection.ownerId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this collection');
    }
    collection.artworkIds = collection.artworkIds.filter((existing) => existing.toString() !== artworkId);
    await collection.save();
    return collection;
  }

  async remove(id: string, requesterId: string): Promise<void> {
    const collection = await this.findByIdOrThrow(id);
    if (collection.ownerId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this collection');
    }
    await collection.deleteOne();
  }

  toDto(collection: CollectionDocument): CollectionDto {
    return {
      id: collection._id.toString(),
      ownerId: collection.ownerId.toString(),
      name: collection.name,
      description: collection.description,
      visibility: collection.visibility,
      artworkIds: collection.artworkIds.map((id) => id.toString()),
      createdAt: (collection.createdAt ?? new Date()).toISOString(),
      updatedAt: (collection.updatedAt ?? new Date()).toISOString(),
    };
  }
}
