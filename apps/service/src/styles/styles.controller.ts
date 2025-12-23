import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { StyleCreateDto } from "./dto/styles-create.dto";
import { StylesListQueryDto, StylesListResponseDto } from "./dto/styles-list.dto";
import { StyleUpdateDto } from "./dto/styles-update.dto";
import { StyleDocument } from "./schemas/styles.schema";
import { StylesService } from "./styles.service";

@Controller("styles")
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get("list")
  async getStylesList(
    @Query() query: StylesListQueryDto
  ): Promise<StylesListResponseDto> {
    return this.stylesService.getStylesList(query);
  }

  @Get(":styleId")
  async getStyleById(@Param("styleId") styleId: string): Promise<StyleDocument> {
    return this.stylesService.getStyleById(styleId);
  }

  @Post("create")
  async createStyle(@Body() dto: StyleCreateDto): Promise<StyleDocument> {
    return this.stylesService.createStyle(dto);
  }

  @Patch("update")
  async updateStyle(@Body() dto: StyleUpdateDto): Promise<StyleDocument> {
    return this.stylesService.updateStyle(dto);
  }
}
