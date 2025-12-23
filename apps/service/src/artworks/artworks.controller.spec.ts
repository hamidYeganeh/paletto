import { Test, TestingModule } from "@nestjs/testing";
import { ArtworksController } from "./artworks.controller";
import { ArtworksService } from "./artworks.service";

describe("ArtworksController", () => {
  let controller: ArtworksController;
  const artworksService = {
    ping: jest.fn(() => ({ ok: true })),
    getArtworksList: jest.fn(),
    createArtwork: jest.fn(),
    updateArtwork: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworksController],
      providers: [
        {
          provide: ArtworksService,
          useValue: artworksService,
        },
      ],
    }).compile();

    controller = module.get<ArtworksController>(ArtworksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should ping", () => {
    expect(controller.ping()).toEqual({ ok: true });
  });
});
