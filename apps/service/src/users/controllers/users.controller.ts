import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserProfileUpdateDto } from "../dto/users-profile.dto";
import { UsersService } from "../users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import type { AuthenticatedRequest } from "src/auth/types/authenticated-request";
import {
  UserArtworkRefDto,
  UserBlogRefDto,
} from "../dto/profile-interactions.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("profile/update")
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserProfileUpdateDto
  ) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get("profile/get")
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Post("profile/saved/artworks")
  async saveArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserArtworkRefDto
  ) {
    return this.usersService.saveArtwork(req.user.userId, dto.artworkId);
  }

  @Delete("profile/saved/artworks")
  async unsaveArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserArtworkRefDto
  ) {
    return this.usersService.unsaveArtwork(req.user.userId, dto.artworkId);
  }

  @Get("profile/saved/artworks")
  async listSavedArtworks(@Req() req: AuthenticatedRequest) {
    return this.usersService.listSavedArtworks(req.user.userId);
  }

  @Post("profile/saved/blogs")
  async saveBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserBlogRefDto
  ) {
    return this.usersService.saveBlog(req.user.userId, dto.blogId);
  }

  @Delete("profile/saved/blogs")
  async unsaveBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserBlogRefDto
  ) {
    return this.usersService.unsaveBlog(req.user.userId, dto.blogId);
  }

  @Get("profile/saved/blogs")
  async listSavedBlogs(@Req() req: AuthenticatedRequest) {
    return this.usersService.listSavedBlogs(req.user.userId);
  }

  @Post("profile/liked/artworks")
  async likeArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserArtworkRefDto
  ) {
    return this.usersService.likeArtwork(req.user.userId, dto.artworkId);
  }

  @Delete("profile/liked/artworks")
  async unlikeArtwork(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserArtworkRefDto
  ) {
    return this.usersService.unlikeArtwork(req.user.userId, dto.artworkId);
  }

  @Get("profile/liked/artworks")
  async listLikedArtworks(@Req() req: AuthenticatedRequest) {
    return this.usersService.listLikedArtworks(req.user.userId);
  }

  @Post("profile/liked/blogs")
  async likeBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserBlogRefDto
  ) {
    return this.usersService.likeBlog(req.user.userId, dto.blogId);
  }

  @Delete("profile/liked/blogs")
  async unlikeBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserBlogRefDto
  ) {
    return this.usersService.unlikeBlog(req.user.userId, dto.blogId);
  }

  @Get("profile/liked/blogs")
  async listLikedBlogs(@Req() req: AuthenticatedRequest) {
    return this.usersService.listLikedBlogs(req.user.userId);
  }
}
