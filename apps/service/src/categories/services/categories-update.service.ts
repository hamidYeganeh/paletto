import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../schemas/categories.schema";
import { Model, Types, UpdateQuery } from "mongoose";
import { CategoryUpdateDto } from "../dto/categories-update.dto";

@Injectable()
export class CategoriesUpdateService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: CategoryUpdateDto): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(dto.categoryID)) {
      throw new NotFoundException("Invalid category id");
    }

    const updateFields: UpdateQuery<CategoryDocument> = {};

    try {
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== "categoryID" && value !== undefined) {
          updateFields[key] = value;
        }
      });

      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(
          dto.categoryID,
          { $set: updateFields },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException("Category not found");
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException("Failed to update category");
    }
  }
}
