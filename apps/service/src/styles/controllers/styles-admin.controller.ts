import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateStyleDto } from "../dto/create-style.dto";
import { ListStylesQueryDto } from "../dto/list-styles.dto";
import { UpdateStyleDto } from "../dto/update-style.dto";
import { UpdateStyleStatusDto } from "../dto/update-style-status.dto";
import { StylesService } from "../styles.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/styles")
export class StylesAdminController {
  constructor(private readonly stylesService: StylesService) {}

  @Post("create")
  async createStyle(@Body() dto: CreateStyleDto) {
    return this.stylesService.createStyle(dto);
  }

  @Get("list")
  async listStyles(@Query() query: ListStylesQueryDto) {
    return this.stylesService.listStyles(query);
  }

  @Patch("update")
  async updateStyle(@Body() dto: UpdateStyleDto) {
    return this.stylesService.updateStyle(dto);
  }

  @Patch("update-status")
  async updateStyleStatus(@Body() dto: UpdateStyleStatusDto) {
    return this.stylesService.updateStyleStatus(dto);
  }
}
