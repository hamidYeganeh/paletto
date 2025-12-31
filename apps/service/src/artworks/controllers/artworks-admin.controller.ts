import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "src/auth/auth.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { ArtworksService } from "../artworks.service";
import { ListArtworksQueryDto } from "../dto/list-artworks.dto";
import { UpdateArtworkStatusDto } from "../dto/update-artwork-status.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/artworks")
export class ArtworksAdminController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get("list")
  async listArtworks(@Query() query: ListArtworksQueryDto) {
    return this.artworksService.listArtworks(query);
  }

  @Patch("update")
  async updateArtworkStatus(@Body() dto: UpdateArtworkStatusDto) {
    return this.artworksService.updateArtworkStatus(dto);
  }
}
