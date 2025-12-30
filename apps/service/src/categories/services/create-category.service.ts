import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { Category, CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class CreateCategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      slug: dto.slug.trim(),
      status: dto.status,
    });

    return category;
  }
}
