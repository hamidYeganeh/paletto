import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateStyleDto } from "../dto/create-style.dto";
import { Style, StyleDocument } from "../schemas/style.schema";

@Injectable()
export class CreateStyleService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: CreateStyleDto): Promise<StyleDocument> {
    const style = await this.styleModel.create({
      title: dto.title.trim(),
      description: dto.description?.trim(),
      slug: dto.slug.trim(),
      status: dto.status,
    });

    return style;
  }
}
