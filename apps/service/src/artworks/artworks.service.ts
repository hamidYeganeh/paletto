import { Injectable } from "@nestjs/common";
import { CreateArtworkDto } from "./dto/create-artwork.dto";
import { CreateArtworkService } from "./create-artwork.service";

@Injectable()
export class ArtworksService {
  constructor(
    private readonly createArtworkService: CreateArtworkService,
  ) {}

  async createForArtist(userId: string, dto: CreateArtworkDto) {
    return this.createArtworkService.execute(userId, dto);
  }
}
