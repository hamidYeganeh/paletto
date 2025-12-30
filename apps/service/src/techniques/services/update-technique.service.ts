import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateTechniqueDto } from "../dto/update-technique.dto";
import { Technique, TechniqueDocument } from "../schemas/technique.schema";

@Injectable()
export class UpdateTechniqueService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(dto: UpdateTechniqueDto): Promise<TechniqueDocument> {
    const techniqueId = dto.techniqueId?.trim();
    if (!techniqueId || !Types.ObjectId.isValid(techniqueId)) {
      throw new BadRequestException("Invalid technique id");
    }

    const updatePayload: Partial<Technique> = {};

    if (dto.title !== undefined) {
      updatePayload.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      updatePayload.description = dto.description?.trim();
    }

    if (dto.slug !== undefined) {
      updatePayload.slug = dto.slug.trim();
    }

    if (dto.status !== undefined) {
      updatePayload.status = dto.status;
    }

    const technique = await this.techniqueModel
      .findByIdAndUpdate(
        techniqueId,
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
      .exec();

    if (!technique) {
      throw new NotFoundException("Technique not found");
    }

    return technique;
  }
}
