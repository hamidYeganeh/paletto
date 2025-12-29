import { Injectable } from "@nestjs/common";
import { CreateArtworkDto } from "./dto/create-artwork.dto";
import { CreateArtworkService } from "./services/create-artwork.service";
import {
  ListArtworksQueryDto,
  ListArtworksResponseDto,
} from "./dto/list-artworks.dto";
import { ListArtworksService } from "./services/list-artworks.service";
import { UpdateArtworkDto } from "./dto/update-artwork.dto";
import { UpdateArtworkService } from "./services/update-artwork.service";
import { ArtworkDocument } from "./schemas/artwork.schema";

@Injectable()
export class ArtworksService {
  constructor(
    private readonly createArtworkService: CreateArtworkService,
    private readonly listArtworksService: ListArtworksService,
    private readonly updateArtworkService: UpdateArtworkService
  ) {}

  async getArtworks(
    dto: ListArtworksQueryDto
  ): Promise<ListArtworksResponseDto> {
    return this.listArtworksService.execute(dto);
  }

  async createForArtist(
    userId: string,
    dto: CreateArtworkDto
  ): Promise<ArtworkDocument> {
    return this.createArtworkService.execute(userId, dto);
  }

  async updateArtwork(
    userId: string,
    dto: UpdateArtworkDto
  ): Promise<ArtworkDocument> {
    return this.updateArtworkService.execute(userId, dto);
  }
}
