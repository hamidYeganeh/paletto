import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { RolesGuard } from "src/auth/guards/role.guards";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { ArtworksService } from "./artworks.service";
import { CreateArtworkDto } from "./dto/create-artwork.dto";
import { ListArtworksQueryDto } from "./dto/list-artworks.dto";
import { UpdateArtworkDto } from "./dto/update-artwork.dto";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller("artworks")
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get("list")
  async getArtworksList(@Query() query: ListArtworksQueryDto) {
    return this.artworksService.getArtworks(query);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(IUserRoles.ARTIST)
  async createArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateArtworkDto
  ) {
    return this.artworksService.createForArtist(req.user.userId, dto);
  }

  @Patch("update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(IUserRoles.ARTIST)
  async updateArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateArtworkDto
  ) {
    return this.artworksService.updateArtwork(req.user.userId, dto);
  }
}
