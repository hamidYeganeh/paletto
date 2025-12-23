import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Medium, MediumDocument } from "../schemas/mediums.schema";

@Injectable()
export class MediumsFindOneService {
  constructor(
    @InjectModel(Medium.name)
    private readonly mediumModel: Model<MediumDocument>
  ) {}

  async execute(mediumId: string): Promise<MediumDocument> {
    if (!Types.ObjectId.isValid(mediumId)) {
      throw new NotFoundException("Invalid medium id");
    }

    try {
      const medium = await this.mediumModel.findById(mediumId).exec();

      if (!medium) {
        throw new NotFoundException("Medium not found");
      }

      return medium;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to load medium");
    }
  }
}

