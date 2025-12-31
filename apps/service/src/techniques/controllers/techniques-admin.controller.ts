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
import { CreateTechniqueDto } from "../dto/create-technique.dto";
import { ListTechniquesQueryDto } from "../dto/list-techniques.dto";
import { UpdateTechniqueDto } from "../dto/update-technique.dto";
import { UpdateTechniqueStatusDto } from "../dto/update-technique-status.dto";
import { TechniquesService } from "../techniques.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/techniques")
export class TechniquesAdminController {
  constructor(private readonly techniquesService: TechniquesService) {}

  @Post("create")
  async createTechnique(@Body() dto: CreateTechniqueDto) {
    return this.techniquesService.createTechnique(dto);
  }

  @Get("list")
  async listTechniques(@Query() query: ListTechniquesQueryDto) {
    return this.techniquesService.listTechniques(query);
  }

  @Patch("update")
  async updateTechnique(@Body() dto: UpdateTechniqueDto) {
    return this.techniquesService.updateTechnique(dto);
  }

  @Patch("update-status")
  async updateTechniqueStatus(@Body() dto: UpdateTechniqueStatusDto) {
    return this.techniquesService.updateTechniqueStatus(dto);
  }
}
