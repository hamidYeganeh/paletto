import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TechniqueUpdateDto } from "../dto/techniques-update.dto";
import { Technique, TechniqueDocument } from "../schemas/techniques.schema";

@Injectable()
export class TechniquesUpdateService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(dto: TechniqueUpdateDto): Promise<TechniqueDocument> {
    if (!Types.ObjectId.isValid(dto.techniqueID)) {
      throw new NotFoundException("Invalid technique id");
    }

    const updateFields: Record<string, unknown> = {};

    try {
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== "techniqueID" && value !== undefined) {
          updateFields[key] = value;
        }
      });

      const updatedTechnique = await this.techniqueModel
        .findByIdAndUpdate(
          dto.techniqueID,
          { $set: updateFields },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedTechnique) {
        throw new NotFoundException("Technique not found");
      }

      return updatedTechnique;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to update technique");
    }
  }
}

