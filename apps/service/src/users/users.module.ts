import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/users.schema";
import { ListUsersService } from "./services/list-users.service";
import { GetUserProfileService } from "./services/get-user-profile.service";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { UsersAdminController } from "./controllers/users-admin.controller";
import { UserProfile, UserProfileSchema } from "./schemas/users-profile.schema";
import { Artist, ArtistSchema } from "./schemas/artists-profile.schema";
import { CreateArtistService } from "./services/create-artist.service";
import { UpdateArtistService } from "./services/update-artist.service";
import { ArtistsController } from "./controllers/artists.controller";
import { ArtistAccessService } from "./services/artist-access.service";
import { UpdateUserStatusService } from "./services/update-user-status.service";
import { ProfileInteractionsService } from "./services/profile-interactions.service";
import { Artwork, ArtworkSchema } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogSchema } from "src/blogs/schemas/blog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Artwork.name, schema: ArtworkSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [UsersController, UsersAdminController, ArtistsController],
  providers: [
    UsersService,
    ListUsersService,
    UpdateUserProfileService,
    GetUserProfileService,
    CreateArtistService,
    UpdateArtistService,
    ArtistAccessService,
    UpdateUserStatusService,
    ProfileInteractionsService,
  ],
  exports: [MongooseModule, UsersService, ArtistAccessService],
})
export class UsersModule {}
