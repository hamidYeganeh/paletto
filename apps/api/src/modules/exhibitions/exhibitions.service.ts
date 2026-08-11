import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExhibitionDto } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Exhibition, ExhibitionDocument } from './schemas/exhibition.schema';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';

@Injectable()
export class ExhibitionsService {
  constructor(@InjectModel(Exhibition.name) private readonly exhibitionModel: Model<ExhibitionDocument>) {}

  async findAll(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const [items, total] = await Promise.all([
      this.exhibitionModel.find().sort({ startDate: -1, createdAt: -1 }).skip(skip).limit(l).exec(),
      this.exhibitionModel.countDocuments().exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async findBySlug(slug: string): Promise<ExhibitionDocument> {
    const exhibition = await this.exhibitionModel.findOne({ slug }).exec();
    if (!exhibition) throw new NotFoundException('Exhibition not found');
    return exhibition;
  }

  async findById(id: string): Promise<ExhibitionDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Exhibition not found');
    const exhibition = await this.exhibitionModel.findById(id).exec();
    if (!exhibition) throw new NotFoundException('Exhibition not found');
    return exhibition;
  }

  async create(dto: CreateExhibitionDto): Promise<ExhibitionDocument> {
    const created = new this.exhibitionModel({
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      coverImageUrl: dto.coverImageUrl,
      artworkIds: (dto.artworkIds ?? []).filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id)),
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status,
    });
    return created.save();
  }

  async update(id: string, dto: UpdateExhibitionDto): Promise<ExhibitionDocument> {
    const exhibition = await this.findById(id);
    Object.assign(exhibition, {
      ...dto,
      artworkIds: dto.artworkIds
        ? dto.artworkIds.filter((aid) => Types.ObjectId.isValid(aid)).map((aid) => new Types.ObjectId(aid))
        : exhibition.artworkIds,
      startDate: dto.startDate ? new Date(dto.startDate) : exhibition.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : exhibition.endDate,
    });
    return exhibition.save();
  }

  async remove(id: string): Promise<void> {
    const exhibition = await this.findById(id);
    await exhibition.deleteOne();
  }

  async count(): Promise<number> {
    return this.exhibitionModel.countDocuments().exec();
  }

  toDto(exhibition: ExhibitionDocument): ExhibitionDto {
    return {
      id: exhibition._id.toString(),
      title: exhibition.title,
      slug: exhibition.slug,
      description: exhibition.description,
      coverImageUrl: exhibition.coverImageUrl,
      status: exhibition.status,
      artworkIds: exhibition.artworkIds.map((id) => id.toString()),
      startDate: exhibition.startDate?.toISOString(),
      endDate: exhibition.endDate?.toISOString(),
      createdAt: (exhibition.createdAt ?? new Date()).toISOString(),
      updatedAt: (exhibition.updatedAt ?? new Date()).toISOString(),
    };
  }
}
