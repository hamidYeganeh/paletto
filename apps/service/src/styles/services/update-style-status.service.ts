import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateStyleStatusDto } from "../dto/update-style-status.dto";
import { Style, StyleDocument } from "../schemas/style.schema";

@Injectable()
export class UpdateStyleStatusService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: UpdateStyleStatusDto): Promise<StyleDocument> {
    const styleId = dto.styleId?.trim();
    if (!styleId || !Types.ObjectId.isValid(styleId)) {
      throw new BadRequestException("Invalid style id");
    }

    const style = await this.styleModel
      .findByIdAndUpdate(
        styleId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!style) {
      throw new NotFoundException("Style not found");
    }

    return style;
  }
}
