import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetTechniqueDto } from "../dto/get-technique.dto";
import { ListTechniquesQueryDto } from "../dto/list-techniques.dto";
import { TechniquesService } from "../techniques.service";

const PUBLIC_TECHNIQUE_STATUS = "active";

@Controller("techniques")
export class TechniquesController {
  constructor(private readonly techniquesService: TechniquesService) {}

  @Post("get")
  async getTechnique(@Body() dto: GetTechniqueDto) {
    return this.techniquesService.getTechnique(dto);
  }

  @Get("list")
  async listTechniques(@Query() query: ListTechniquesQueryDto) {
    return this.techniquesService.listTechniques({
      ...query,
      status: PUBLIC_TECHNIQUE_STATUS,
    });
  }
}
