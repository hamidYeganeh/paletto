import { Injectable } from "@nestjs/common";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { GetTechniqueDto } from "./dto/get-technique.dto";
import {
  ListTechniquesQueryDto,
  ListTechniquesResponseDto,
} from "./dto/list-techniques.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { UpdateTechniqueStatusDto } from "./dto/update-technique-status.dto";
import { TechniqueDocument } from "./schemas/technique.schema";
import { CreateTechniqueService } from "./services/create-technique.service";
import { GetTechniqueService } from "./services/get-technique.service";
import { ListTechniquesService } from "./services/list-techniques.service";
import { UpdateTechniqueService } from "./services/update-technique.service";
import { UpdateTechniqueStatusService } from "./services/update-technique-status.service";

@Injectable()
export class TechniquesService {
  constructor(
    private readonly createTechniqueService: CreateTechniqueService,
    private readonly getTechniqueService: GetTechniqueService,
    private readonly listTechniquesService: ListTechniquesService,
    private readonly updateTechniqueService: UpdateTechniqueService,
    private readonly updateTechniqueStatusService: UpdateTechniqueStatusService
  ) {}

  async createTechnique(dto: CreateTechniqueDto): Promise<TechniqueDocument> {
    return this.createTechniqueService.execute(dto);
  }

  async getTechnique(dto: GetTechniqueDto): Promise<TechniqueDocument> {
    return this.getTechniqueService.execute(dto);
  }

  async listTechniques(
    dto: ListTechniquesQueryDto
  ): Promise<ListTechniquesResponseDto> {
    return this.listTechniquesService.execute(dto);
  }

  async updateTechnique(dto: UpdateTechniqueDto): Promise<TechniqueDocument> {
    return this.updateTechniqueService.execute(dto);
  }

  async updateTechniqueStatus(
    dto: UpdateTechniqueStatusDto
  ): Promise<TechniqueDocument> {
    return this.updateTechniqueStatusService.execute(dto);
  }
}
