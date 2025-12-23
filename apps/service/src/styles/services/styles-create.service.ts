import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { StyleCreateDto } from "../dto/styles-create.dto";
import { Style, StyleDocument } from "../schemas/styles.schema";

@Injectable()
export class StylesCreateService {
  constructor(
    @InjectModel(Style.name) private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: StyleCreateDto): Promise<StyleDocument> {
    try {
      const payload = {
        ...dto,
        slug: dto?.slug ?? slugify(dto.title, { lower: true }),
      };
      const created = await this.styleModel.create(payload);
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
          `Style with title '${dto.title}' already exists `
        );
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to create style");
    }
  }
}

