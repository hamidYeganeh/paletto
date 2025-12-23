import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ArtworksService } from "./artworks.service";
import { ArtworkCreateDto } from "./dto/artworks-create.dto";
import { ArtworksListQueryDto, ArtworksListResponseDto } from "./dto/artworks-list.dto";
import { ArtworkUpdateDto } from "./dto/artworks-update.dto";
import { ArtworkDocument } from "./schemas/artwork.schema";

@Controller("artworks")
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get("list")
  async getArtworksList(
    @Query() query: ArtworksListQueryDto
  ): Promise<ArtworksListResponseDto> {
    return this.artworksService.getArtworksList(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createArtwork(
    @Req() req,
    @Body() dto: ArtworkCreateDto
  ): Promise<ArtworkDocument> {
    return this.artworksService.createArtwork(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update")
  async updateArtwork(
    @Req() req,
    @Body() dto: ArtworkUpdateDto
  ): Promise<ArtworkDocument> {
    return this.artworksService.updateArtwork(req.user, dto);
  }
}
