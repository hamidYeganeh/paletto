import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category, CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class UpdateCategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: UpdateCategoryDto): Promise<CategoryDocument> {
    const categoryId = dto.categoryId?.trim();
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException("Invalid category id");
    }

    const updatePayload: Partial<Category> = {};

    if (dto.title !== undefined) {
      updatePayload.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      updatePayload.description = dto.description?.trim();
    }

    if (dto.slug !== undefined) {
      updatePayload.slug = dto.slug.trim();
    }

    if (dto.status !== undefined) {
      updatePayload.status = dto.status;
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
      .exec();

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }
}
