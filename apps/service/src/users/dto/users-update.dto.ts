import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { UserCreateDto } from "./users-create.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { UsersUserProfileUpdateDto } from "./users-user-profile-update.dto";
import { UsersArtistProfileUpdateDto } from "./users-artist-profile-update.dto";

export class UserUpdateDto extends PartialType(
  OmitType(UserCreateDto, ["password", "role"])
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UsersUserProfileUpdateDto)
  userProfile: UsersUserProfileUpdateDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UsersArtistProfileUpdateDto)
  artistProfile: UsersArtistProfileUpdateDto;
}
