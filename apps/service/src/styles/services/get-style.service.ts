import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GetStyleDto } from "../dto/get-style.dto";
import { Style, StyleDocument } from "../schemas/style.schema";

@Injectable()
export class GetStyleService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>
  ) {}

  async execute(dto: GetStyleDto): Promise<StyleDocument> {
    const styleObjectId = this.toObjectId(dto.styleId, "Invalid style id");

    const style = await this.styleModel.findById(styleObjectId).exec();

    if (!style) {
      throw new NotFoundException("Style not found");
    }

    return style;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
