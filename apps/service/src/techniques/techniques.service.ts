import { Injectable } from "@nestjs/common";
import { TechniqueCreateDto } from "./dto/techniques-create.dto";
import {
  TechniquesListQueryDto,
  TechniquesListResponseDto,
} from "./dto/techniques-list.dto";
import { TechniqueUpdateDto } from "./dto/techniques-update.dto";
import { TechniqueDocument } from "./schemas/techniques.schema";
import { TechniquesCreateService } from "./services/techniques-create.service";
import { TechniquesFindOneService } from "./services/techniques-find-one.service";
import { TechniquesListService } from "./services/techniques-list.service";
import { TechniquesUpdateService } from "./services/techniques-update.service";

@Injectable()
export class TechniquesService {
  constructor(
    private readonly techniquesListService: TechniquesListService,
    private readonly techniquesCreateService: TechniquesCreateService,
    private readonly techniquesUpdateService: TechniquesUpdateService,
    private readonly techniquesFindOneService: TechniquesFindOneService
  ) {}

  async getTechniquesList(
    query: TechniquesListQueryDto
  ): Promise<TechniquesListResponseDto> {
    return this.techniquesListService.execute(query);
  }

  async getTechniqueById(techniqueId: string): Promise<TechniqueDocument> {
    return this.techniquesFindOneService.execute(techniqueId);
  }

  async createTechnique(dto: TechniqueCreateDto): Promise<TechniqueDocument> {
    return this.techniquesCreateService.execute(dto);
  }

  async updateTechnique(dto: TechniqueUpdateDto): Promise<TechniqueDocument> {
    return this.techniquesUpdateService.execute(dto);
  }
}
