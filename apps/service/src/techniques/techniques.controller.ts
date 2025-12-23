import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TechniqueCreateDto } from "./dto/techniques-create.dto";
import {
  TechniquesListQueryDto,
  TechniquesListResponseDto,
} from "./dto/techniques-list.dto";
import { TechniqueUpdateDto } from "./dto/techniques-update.dto";
import { TechniqueDocument } from "./schemas/techniques.schema";
import { TechniquesService } from "./techniques.service";

@Controller("techniques")
export class TechniquesController {
  constructor(private readonly techniquesService: TechniquesService) {}

  @Get("list")
  async getTechniquesList(
    @Query() query: TechniquesListQueryDto
  ): Promise<TechniquesListResponseDto> {
    return this.techniquesService.getTechniquesList(query);
  }

  @Get(":techniqueId")
  async getTechniqueById(
    @Param("techniqueId") techniqueId: string
  ): Promise<TechniqueDocument> {
    return this.techniquesService.getTechniqueById(techniqueId);
  }

  @Post("create")
  async createTechnique(
    @Body() dto: TechniqueCreateDto
  ): Promise<TechniqueDocument> {
    return this.techniquesService.createTechnique(dto);
  }

  @Patch("update")
  async updateTechnique(
    @Body() dto: TechniqueUpdateDto
  ): Promise<TechniqueDocument> {
    return this.techniquesService.updateTechnique(dto);
  }
}
