import { Body, Controller, Patch, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { TechniquesService } from "./techniques.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/techniques")
export class TechniquesAdminController {
  constructor(private readonly techniquesService: TechniquesService) {}

  @Post("create")
  async createTechnique(@Body() dto: CreateTechniqueDto) {
    return this.techniquesService.createTechnique(dto);
  }

  @Patch("update")
  async updateTechnique(@Body() dto: UpdateTechniqueDto) {
    return this.techniquesService.updateTechnique(dto);
  }
}
