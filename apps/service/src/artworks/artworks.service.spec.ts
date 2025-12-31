import { Test, TestingModule } from "@nestjs/testing";
import { ArtworksService } from "./artworks.service";
import { CreateArtworkService } from "./services/create-artwork.service";
import { GetArtworkService } from "./services/get-artwork.service";
import { ListArtworksService } from "./services/list-artworks.service";
import { UpdateArtworkService } from "./services/update-artwork.service";
import { UpdateArtworkStatusService } from "./services/update-artwork-status.service";

describe('ArtworksService', () => {
  let service: ArtworksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtworksService,
        { provide: CreateArtworkService, useValue: {} },
        { provide: GetArtworkService, useValue: {} },
        { provide: ListArtworksService, useValue: {} },
        { provide: UpdateArtworkService, useValue: {} },
        { provide: UpdateArtworkStatusService, useValue: {} },
      ],
    }).compile();

    service = module.get<ArtworksService>(ArtworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
