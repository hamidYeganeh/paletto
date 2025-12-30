import { Body, Controller, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateStyleDto } from "./dto/create-style.dto";
import { UpdateStyleDto } from "./dto/update-style.dto";
import { StylesService } from "./styles.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/styles")
export class StylesAdminController {
  constructor(private readonly stylesService: StylesService) {}

  @Post("create")
  async createStyle(@Body() dto: CreateStyleDto) {
    return this.stylesService.createStyle(dto);
  }

  @Patch("update")
  async updateStyle(@Body() dto: UpdateStyleDto) {
    return this.stylesService.updateStyle(dto);
  }
}
