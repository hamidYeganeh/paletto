import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { RolesGuard } from "src/auth/guards/role.guards";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { ArtworksService } from "./artworks.service";
import { CreateArtworkDto } from "./dto/create-artwork.dto";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("artworks")
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Post("create")
  @Roles(IUserRoles.ARTIST)
  async createArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateArtworkDto
  ) {
    return this.artworksService.createForArtist(req.user.userId, dto);
  }
}
