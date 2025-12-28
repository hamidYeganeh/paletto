import { Body, Controller, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { RolesGuard } from "src/auth/guards/role.guards";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UsersService } from "../users.service";
import { ArtistCreateDto } from "../dto/artist-create.dto";
import { ArtistUpdateDto } from "../dto/artist-update.dto";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("artists")
export class ArtistsController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  async createArtist(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ArtistCreateDto
  ) {
    return this.usersService.createArtist(req.user.userId, dto);
  }

  @Patch("update")
  async updateArtist(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ArtistUpdateDto
  ) {
    return this.usersService.updateArtist(req.user.userId, dto);
  }
}
