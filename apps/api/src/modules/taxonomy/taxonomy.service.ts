import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryDto, TagDto } from '@workspace/shared';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  async findAllCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryModel.find().sort({ name: 1 }).exec();
    return categories.map((c) => this.categoryToDto(c));
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    const created = await this.categoryModel.create({
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : undefined,
    });
    return this.categoryToDto(created);
  }

  async findAllTags(): Promise<TagDto[]> {
    const tags = await this.tagModel.find().sort({ name: 1 }).exec();
    return tags.map((t) => this.tagToDto(t));
  }

  async createTag(dto: CreateTagDto): Promise<TagDto> {
    const created = await this.tagModel.create({ name: dto.name, slug: dto.slug });
    return this.tagToDto(created);
  }

  categoryToDto(category: CategoryDocument): CategoryDto {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      parentId: category.parentId?.toString(),
    };
  }

  tagToDto(tag: TagDocument): TagDto {
    return { id: tag._id.toString(), name: tag.name, slug: tag.slug };
  }
}
