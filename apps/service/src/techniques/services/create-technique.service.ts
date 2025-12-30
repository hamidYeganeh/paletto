import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateTechniqueDto } from "../dto/create-technique.dto";
import { Technique, TechniqueDocument } from "../schemas/technique.schema";

@Injectable()
export class CreateTechniqueService {
  constructor(
    @InjectModel(Technique.name)
    private readonly techniqueModel: Model<TechniqueDocument>
  ) {}

  async execute(dto: CreateTechniqueDto): Promise<TechniqueDocument> {
    const technique = await this.techniqueModel.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      slug: dto.slug.trim(),
      status: dto.status,
    });

    return technique;
  }
}
