import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { MediumsService } from "./mediums.service";
import {
  MediumsListQueryDto,
  MediumsListResponseDto,
} from "./dto/mediums-list.dto";
import { MediumDocument } from "./schemas/mediums.schema";
import { MediumCreateDto } from "./dto/mediums-create.dto";
import { MediumUpdateDto } from "./dto/mediums-update.dto";

@Controller("mediums")
export class MediumsController {
  constructor(private readonly mediumsService: MediumsService) {}

  @Get("list")
  async getMediumsList(
    @Query() query: MediumsListQueryDto
  ): Promise<MediumsListResponseDto> {
    return this.mediumsService.getMediumsList(query);
  }

  @Get(":mediumId")
  async getMediumById(
    @Param("mediumId") mediumId: string
  ): Promise<MediumDocument> {
    return this.mediumsService.getMediumById(mediumId);
  }

  @Get("details/:mediumID")
  async getMediumByIdLegacy(
    @Param("mediumID") mediumId: string
  ): Promise<MediumDocument> {
    return this.mediumsService.getMediumById(mediumId);
  }

  @Post("create")
  async createMedium(@Body() dto: MediumCreateDto): Promise<MediumDocument> {
    return this.mediumsService.createMedium(dto);
  }

  @Patch("update")
  async updateMedium(@Body() dto: MediumUpdateDto): Promise<MediumDocument> {
    return this.mediumsService.updateMedium(dto);
  }
}
