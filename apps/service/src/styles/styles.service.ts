import { Injectable } from "@nestjs/common";
import { CreateStyleDto } from "./dto/create-style.dto";
import { GetStyleDto } from "./dto/get-style.dto";
import {
  ListStylesQueryDto,
  ListStylesResponseDto,
} from "./dto/list-styles.dto";
import { UpdateStyleDto } from "./dto/update-style.dto";
import { UpdateStyleStatusDto } from "./dto/update-style-status.dto";
import { StyleDocument } from "./schemas/style.schema";
import { CreateStyleService } from "./services/create-style.service";
import { GetStyleService } from "./services/get-style.service";
import { ListStylesService } from "./services/list-styles.service";
import { UpdateStyleService } from "./services/update-style.service";
import { UpdateStyleStatusService } from "./services/update-style-status.service";

@Injectable()
export class StylesService {
  constructor(
    private readonly createStyleService: CreateStyleService,
    private readonly getStyleService: GetStyleService,
    private readonly listStylesService: ListStylesService,
    private readonly updateStyleService: UpdateStyleService,
    private readonly updateStyleStatusService: UpdateStyleStatusService
  ) {}

  async createStyle(dto: CreateStyleDto): Promise<StyleDocument> {
    return this.createStyleService.execute(dto);
  }

  async getStyle(dto: GetStyleDto): Promise<StyleDocument> {
    return this.getStyleService.execute(dto);
  }

  async listStyles(
    dto: ListStylesQueryDto
  ): Promise<ListStylesResponseDto> {
    return this.listStylesService.execute(dto);
  }

  async updateStyle(dto: UpdateStyleDto): Promise<StyleDocument> {
    return this.updateStyleService.execute(dto);
  }

  async updateStyleStatus(
    dto: UpdateStyleStatusDto
  ): Promise<StyleDocument> {
    return this.updateStyleStatusService.execute(dto);
  }
}
