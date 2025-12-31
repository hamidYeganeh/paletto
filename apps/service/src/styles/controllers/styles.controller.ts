import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetStyleDto } from "../dto/get-style.dto";
import { ListStylesQueryDto } from "../dto/list-styles.dto";
import { StylesService } from "../styles.service";

const PUBLIC_STYLE_STATUS = "active";

@Controller("styles")
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Post("get")
  async getStyle(@Body() dto: GetStyleDto) {
    return this.stylesService.getStyle(dto);
  }

  @Get("list")
  async listStyles(@Query() query: ListStylesQueryDto) {
    return this.stylesService.listStyles({
      ...query,
      status: PUBLIC_STYLE_STATUS,
    });
  }
}
