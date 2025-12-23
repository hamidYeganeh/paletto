import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { MediumCreateDto } from "../dto/mediums-create.dto";
import { Medium, MediumDocument } from "../schemas/mediums.schema";

@Injectable()
export class MediumsCreateService {
  constructor(
    @InjectModel(Medium.name) readonly mediumModel: Model<MediumDocument>
  ) {}

  async execute(dto: MediumCreateDto): Promise<MediumDocument> {
    try {
      const payload = {
        ...dto,
        slug: dto?.slug ?? slugify(dto.title, { lower: true }),
      };
      const created = await this.mediumModel.create(payload);
      return created;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ConflictException(
          `Medium with title '${dto.title}' already exists `
        );
      }

      throw error instanceof Error
        ? new InternalServerErrorException(error.message)
        : new InternalServerErrorException("Failed to create medium");
    }
  }
}

