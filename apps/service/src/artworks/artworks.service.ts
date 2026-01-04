import { Injectable } from "@nestjs/common";
import { CreateArtworkDto } from "./dto/create-artwork.dto";
import { CreateArtworkService } from "./services/create-artwork.service";
import {
  ListArtworksQueryDto,
  ListArtworksResponseDto,
} from "./dto/list-artworks.dto";
import { ListArtworksService } from "./services/list-artworks.service";
import { GetArtworkService } from "./services/get-artwork.service";
import { UpdateArtworkDto } from "./dto/update-artwork.dto";
import { UpdateArtworkService } from "./services/update-artwork.service";
import { ArtworkDocument } from "./schemas/artwork.schema";
import { GetArtworkDto } from "./dto/get-artwork.dto";
import type { ArtworkListItemDto } from "./dto/list-artworks.dto";
import { UpdateArtworkStatusDto } from "./dto/update-artwork-status.dto";
import { UpdateArtworkStatusService } from "./services/update-artwork-status.service";
import { type ListArtworksOptions } from "./services/list-artworks.service";

@Injectable()
export class ArtworksService {
  constructor(
    private readonly createArtworkService: CreateArtworkService,
    private readonly listArtworksService: ListArtworksService,
    private readonly getArtworkService: GetArtworkService,
    private readonly updateArtworkService: UpdateArtworkService,
    private readonly updateArtworkStatusService: UpdateArtworkStatusService
  ) {}

  async listArtworks(
    dto: ListArtworksQueryDto,
    options?: ListArtworksOptions
  ): Promise<ListArtworksResponseDto> {
    return this.listArtworksService.execute(dto, options);
  }

  async createForArtist(
    userId: string,
    dto: CreateArtworkDto
  ): Promise<ArtworkDocument> {
    return this.createArtworkService.execute(userId, dto);
  }

  async getArtwork(
    dto: GetArtworkDto,
    options?: { publicOnly?: boolean }
  ): Promise<ArtworkListItemDto> {
    return this.getArtworkService.execute(dto, options);
  }

  async updateArtwork(
    userId: string,
    dto: UpdateArtworkDto
  ): Promise<ArtworkDocument> {
    return this.updateArtworkService.execute(userId, dto);
  }

  async updateArtworkStatus(
    dto: UpdateArtworkStatusDto
  ): Promise<ArtworkDocument> {
    return this.updateArtworkStatusService.execute(dto);
  }
}
