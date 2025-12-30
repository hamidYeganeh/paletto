import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GetCategoryDto } from "../dto/get-category.dto";
import { Category, CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class GetCategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: GetCategoryDto): Promise<CategoryDocument> {
    const categoryObjectId = this.toObjectId(
      dto.categoryId,
      "Invalid category id"
    );

    const category = await this.categoryModel.findById(categoryObjectId).exec();

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
