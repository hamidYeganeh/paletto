import { Test, TestingModule } from "@nestjs/testing";
import { ArtworksService } from "./artworks.service";
import { ArtworksCreateService } from "./services/artworks-create.service";
import { ArtworksListService } from "./services/artworks-list.service";
import { ArtworksUpdateService } from "./services/artworks-update.service";

describe("ArtworksService", () => {
  let service: ArtworksService;
  const artworksCreateService = { execute: jest.fn() };
  const artworksListService = { execute: jest.fn() };
  const artworksUpdateService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtworksService,
        { provide: ArtworksCreateService, useValue: artworksCreateService },
        { provide: ArtworksListService, useValue: artworksListService },
        { provide: ArtworksUpdateService, useValue: artworksUpdateService },
      ],
    }).compile();

    service = module.get<ArtworksService>(ArtworksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should ping", () => {
    expect(service.ping()).toEqual({ ok: true });
  });
});
