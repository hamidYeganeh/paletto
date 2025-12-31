import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateTechniqueStatusDto } from "../dto/update-technique-status.dto";
import { Technique, TechniqueDocument } from "../schemas/technique.schema";

@Injectable()
export class UpdateTechniqueStatusService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(dto: UpdateTechniqueStatusDto): Promise<TechniqueDocument> {
    const techniqueId = dto.techniqueId?.trim();
    if (!techniqueId || !Types.ObjectId.isValid(techniqueId)) {
      throw new BadRequestException("Invalid technique id");
    }

    const technique = await this.techniqueModel
      .findByIdAndUpdate(
        techniqueId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!technique) {
      throw new NotFoundException("Technique not found");
    }

    return technique;
  }
}
