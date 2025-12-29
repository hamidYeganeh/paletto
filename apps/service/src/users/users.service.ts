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

@Injectable()
export class UsersService {
  constructor(
    private readonly updateUserProfileService: UpdateUserProfileService,
    private readonly getUserProfileService: GetUserProfileService,
    private readonly createArtistService: CreateArtistService,
    private readonly updateArtistService: UpdateArtistService
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
}
