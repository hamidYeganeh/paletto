import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GetTechniqueDto } from "../dto/get-technique.dto";
import { Technique, TechniqueDocument } from "../schemas/technique.schema";

@Injectable()
export class GetTechniqueService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(dto: GetTechniqueDto): Promise<TechniqueDocument> {
    const techniqueObjectId = this.toObjectId(
      dto.techniqueId,
      "Invalid technique id"
    );

    const technique = await this.techniqueModel
      .findById(techniqueObjectId)
      .exec();

    if (!technique) {
      throw new NotFoundException("Technique not found");
    }

    return technique;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
