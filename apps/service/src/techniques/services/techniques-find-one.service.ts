import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Technique, TechniqueDocument } from "../schemas/techniques.schema";

@Injectable()
export class TechniquesFindOneService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(techniqueId: string): Promise<TechniqueDocument> {
    if (!Types.ObjectId.isValid(techniqueId)) {
      throw new NotFoundException("Invalid technique id");
    }

    try {
      const technique = await this.techniqueModel.findById(techniqueId).exec();

      if (!technique) {
        throw new NotFoundException("Technique not found");
      }

      return technique;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to load technique");
    }
  }
}

