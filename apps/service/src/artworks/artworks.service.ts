import { Injectable } from "@nestjs/common";
import { ArtworkCreateDto } from "./dto/artworks-create.dto";
import { ArtworksListQueryDto, ArtworksListResponseDto } from "./dto/artworks-list.dto";
import { ArtworkUpdateDto } from "./dto/artworks-update.dto";
import { ArtworkDocument } from "./schemas/artwork.schema";
import { ArtworksCreateService } from "./services/artworks-create.service";
import { ArtworksListService } from "./services/artworks-list.service";
import { ArtworksUpdateService } from "./services/artworks-update.service";

@Injectable()
export class ArtworksService {
  constructor(
    private readonly artworksCreateService: ArtworksCreateService,
    private readonly artworksListService: ArtworksListService,
    private readonly artworksUpdateService: ArtworksUpdateService
  ) {}

  async createArtwork(
    actor: { id: string; role?: string },
    dto: ArtworkCreateDto
  ): Promise<ArtworkDocument> {
    return this.artworksCreateService.execute(actor, dto);
  }

  async updateArtwork(
    actor: { id: string; role?: string },
    dto: ArtworkUpdateDto
  ): Promise<ArtworkDocument> {
    return this.artworksUpdateService.execute(actor, dto);
  }

  async getArtworksList(
    query: ArtworksListQueryDto
  ): Promise<ArtworksListResponseDto> {
    return this.artworksListService.execute(query);
  }
}
