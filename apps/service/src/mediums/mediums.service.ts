import { Injectable } from "@nestjs/common";
import { MediumsListService } from "./services/mediums-list.service";
import {
  MediumsListQueryDto,
  MediumsListResponseDto,
} from "./dto/mediums-list.dto";
import { MediumCreateDto } from "./dto/mediums-create.dto";
import { MediumUpdateDto } from "./dto/mediums-update.dto";
import { MediumDocument } from "./schemas/mediums.schema";
import { MediumsCreateService } from "./services/mediums-create.service";
import { MediumsUpdateService } from "./services/mediums-update.service";
import { MediumsFindOneService } from "./services/mediums-find-one.service";

@Injectable()
export class MediumsService {
  constructor(
    private readonly mediumsListService: MediumsListService,
    private readonly mediumsCreateService: MediumsCreateService,
    private readonly mediumsUpdateService: MediumsUpdateService,
    private readonly mediumsFindOneService: MediumsFindOneService
  ) {}

  async getMediumsList(
    dto: MediumsListQueryDto
  ): Promise<MediumsListResponseDto> {
    return this.mediumsListService.execute(dto);
  }

  async getMediumById(mediumId: string): Promise<MediumDocument> {
    return this.mediumsFindOneService.execute(mediumId);
  }

  async createMedium(dto: MediumCreateDto): Promise<MediumDocument> {
    return this.mediumsCreateService.execute(dto);
  }

  async updateMedium(dto: MediumUpdateDto): Promise<MediumDocument> {
    return this.mediumsUpdateService.execute(dto);
  }
}
