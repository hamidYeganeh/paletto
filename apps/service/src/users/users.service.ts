import { Injectable } from "@nestjs/common";
import { UserProfileUpdateDto } from "./dto/users-profile.dto";
import { UserProfileDocument } from "./schemas/users-profile.schema";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { GetUserProfileService } from "./services/get-user-profile.service";
import { CreateArtistService } from "./services/create-artist.service";
import { ArtistCreateDto } from "./dto/artist-create.dto";
import { ArtistUpdateDto } from "./dto/artist-update.dto";
import { UpdateArtistService } from "./services/update-artist.service";
import { ArtistDocument } from "./schemas/artists-profile.schema";
import { UserDocument } from "./schemas/users.schema";
import { ListUsersService } from "./services/list-users.service";
import { ListUsersQueryDto, ListUsersResponseDto } from "./dto/list-users.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
import { UpdateUserStatusService } from "./services/update-user-status.service";
import { ProfileInteractionsService } from "./services/profile-interactions.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly updateUserProfileService: UpdateUserProfileService,
    private readonly getUserProfileService: GetUserProfileService,
    private readonly createArtistService: CreateArtistService,
    private readonly updateArtistService: UpdateArtistService,
    private readonly listUsersService: ListUsersService,
    private readonly updateUserStatusService: UpdateUserStatusService,
    private readonly profileInteractionsService: ProfileInteractionsService
  ) {}

  async updateProfile(
    userId: string,
    dto: UserProfileUpdateDto
  ): Promise<UserProfileDocument> {
    return this.updateUserProfileService.execute(userId, dto);
  }

  async getProfile(userId: string) {
    return this.getUserProfileService.execute(userId);
  }

  async createArtist(
    userId: string,
    dto: ArtistCreateDto
  ): Promise<ArtistDocument> {
    return this.createArtistService.execute(userId, dto);
  }

  async updateArtist(
    userId: string,
    dto: ArtistUpdateDto
  ): Promise<ArtistDocument> {
    return this.updateArtistService.execute(userId, dto);
  }

  async listUsers(dto: ListUsersQueryDto): Promise<ListUsersResponseDto> {
    return this.listUsersService.execute(dto);
  }

  async updateUserStatus(dto: UpdateUserStatusDto): Promise<UserDocument> {
    return this.updateUserStatusService.execute(dto);
  }

  async saveArtwork(userId: string, artworkId: string) {
    return this.profileInteractionsService.saveArtwork(userId, artworkId);
  }

  async unsaveArtwork(userId: string, artworkId: string) {
    return this.profileInteractionsService.unsaveArtwork(userId, artworkId);
  }

  async likeArtwork(userId: string, artworkId: string) {
    return this.profileInteractionsService.likeArtwork(userId, artworkId);
  }

  async unlikeArtwork(userId: string, artworkId: string) {
    return this.profileInteractionsService.unlikeArtwork(userId, artworkId);
  }

  async saveBlog(userId: string, blogId: string) {
    return this.profileInteractionsService.saveBlog(userId, blogId);
  }

  async unsaveBlog(userId: string, blogId: string) {
    return this.profileInteractionsService.unsaveBlog(userId, blogId);
  }

  async likeBlog(userId: string, blogId: string) {
    return this.profileInteractionsService.likeBlog(userId, blogId);
  }

  async unlikeBlog(userId: string, blogId: string) {
    return this.profileInteractionsService.unlikeBlog(userId, blogId);
  }

  async listSavedArtworks(userId: string) {
    return this.profileInteractionsService.listSavedArtworks(userId);
  }

  async listSavedBlogs(userId: string) {
    return this.profileInteractionsService.listSavedBlogs(userId);
  }

  async listLikedArtworks(userId: string) {
    return this.profileInteractionsService.listLikedArtworks(userId);
  }

  async listLikedBlogs(userId: string) {
    return this.profileInteractionsService.listLikedBlogs(userId);
  }
}
