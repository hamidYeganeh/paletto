import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateStyleDto } from "../dto/update-style.dto";
import { Style, StyleDocument } from "../schemas/style.schema";

@Injectable()
export class UpdateStyleService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: UpdateStyleDto): Promise<StyleDocument> {
    const styleId = dto.styleId?.trim();
    if (!styleId || !Types.ObjectId.isValid(styleId)) {
      throw new BadRequestException("Invalid style id");
    }

    const updatePayload: Partial<Style> = {};

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

    const style = await this.styleModel
      .findByIdAndUpdate(
        styleId,
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
      .exec();

    if (!style) {
      throw new NotFoundException("Style not found");
    }

    return style;
  }
}
