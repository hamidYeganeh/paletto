import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateCategoryStatusDto } from "../dto/update-category-status.dto";
import { Category, CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class UpdateCategoryStatusService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: UpdateCategoryStatusDto): Promise<CategoryDocument> {
    const categoryId = dto.categoryId?.trim();
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException("Invalid category id");
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }
}
