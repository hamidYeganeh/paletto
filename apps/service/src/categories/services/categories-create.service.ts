import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../schemas/categories.schema";
import { Model } from "mongoose";
import { CategoryCreateDto } from "../dto/categories-create.dto";
import slugify from "slugify";

@Injectable()
export class CategoriesCreateService {
  constructor(
    @InjectModel(Category.name) readonly categoryModel: Model<CategoryDocument>
  ) {}

  async execute(dto: CategoryCreateDto): Promise<CategoryDocument> {
    try {
      const payload = {
        ...dto,
        slug: dto?.slug ?? slugify(dto.title, { lower: true }),
      };
      const created = await this.categoryModel.create(payload);

      return created;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ConflictException(
          `Category with title '${dto.title}' already exists `
        );
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to create category");
    }
  }
}
