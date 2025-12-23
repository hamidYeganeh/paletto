import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Style, StyleDocument } from "../schemas/styles.schema";

@Injectable()
export class StylesFindOneService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(styleId: string): Promise<StyleDocument> {
    if (!Types.ObjectId.isValid(styleId)) {
      throw new NotFoundException("Invalid style id");
    }

    try {
      const style = await this.styleModel.findById(styleId).exec();

      if (!style) {
        throw new NotFoundException("Style not found");
      }

      return style;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to load style");
    }
  }
}

