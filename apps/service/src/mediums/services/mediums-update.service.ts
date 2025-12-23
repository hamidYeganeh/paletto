import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MediumUpdateDto } from "../dto/mediums-update.dto";
import { Medium, MediumDocument } from "../schemas/mediums.schema";

@Injectable()
export class MediumsUpdateService {
  constructor(
    @InjectModel(Medium.name)
    private readonly mediumModel: Model<MediumDocument>
  ) {}

  async execute(dto: MediumUpdateDto): Promise<MediumDocument> {
    if (!Types.ObjectId.isValid(dto.mediumID)) {
      throw new NotFoundException("Invalid medium id");
    }

    const updateFields: Record<string, unknown> = {};

    try {
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== "mediumID" && value !== undefined) {
          updateFields[key] = value;
        }
      });

      const updatedMedium = await this.mediumModel
        .findByIdAndUpdate(
          dto.mediumID,
          { $set: updateFields },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedMedium) {
        throw new NotFoundException("Medium not found");
      }

      return updatedMedium;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to update medium");
    }
  }
}

