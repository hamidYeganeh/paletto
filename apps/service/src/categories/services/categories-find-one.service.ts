import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Category, CategoryDocument } from "../schemas/categories.schema";

@Injectable()
export class CategoriesFindOneService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(categoryId: string): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new NotFoundException("Invalid category id");
    }

    try {
      const category = await this.categoryModel.findById(categoryId).exec();

      if (!category) {
        throw new NotFoundException("Category not found");
      }

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to load category");
    }
  }
}
