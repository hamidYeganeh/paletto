import { Injectable } from "@nestjs/common";
import { StyleCreateDto } from "./dto/styles-create.dto";
import { StylesListQueryDto, StylesListResponseDto } from "./dto/styles-list.dto";
import { StyleUpdateDto } from "./dto/styles-update.dto";
import { StyleDocument } from "./schemas/styles.schema";
import { StylesCreateService } from "./services/styles-create.service";
import { StylesFindOneService } from "./services/styles-find-one.service";
import { StylesListService } from "./services/styles-list.service";
import { StylesUpdateService } from "./services/styles-update.service";

@Injectable()
export class StylesService {
  constructor(
    private readonly stylesListService: StylesListService,
    private readonly stylesCreateService: StylesCreateService,
    private readonly stylesUpdateService: StylesUpdateService,
    private readonly stylesFindOneService: StylesFindOneService
  ) {}

  async getStylesList(query: StylesListQueryDto): Promise<StylesListResponseDto> {
    return this.stylesListService.execute(query);
  }

  async getStyleById(styleId: string): Promise<StyleDocument> {
    return this.stylesFindOneService.execute(styleId);
  }

  async createStyle(dto: StyleCreateDto): Promise<StyleDocument> {
    return this.stylesCreateService.execute(dto);
  }

  async updateStyle(dto: StyleUpdateDto): Promise<StyleDocument> {
    return this.stylesUpdateService.execute(dto);
  }
}
