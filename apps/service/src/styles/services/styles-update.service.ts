import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { StyleUpdateDto } from "../dto/styles-update.dto";
import { Style, StyleDocument } from "../schemas/styles.schema";

@Injectable()
export class StylesUpdateService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: StyleUpdateDto): Promise<StyleDocument> {
    if (!Types.ObjectId.isValid(dto.styleID)) {
      throw new NotFoundException("Invalid style id");
    }

    const updateFields: Record<string, unknown> = {};

    try {
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== "styleID" && value !== undefined) {
          updateFields[key] = value;
        }
      });

      const updatedStyle = await this.styleModel
        .findByIdAndUpdate(
          dto.styleID,
          { $set: updateFields },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedStyle) {
        throw new NotFoundException("Style not found");
      }

      return updatedStyle;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to update style");
    }
  }
}

