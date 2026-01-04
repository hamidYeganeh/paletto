import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class UserArtworkRefDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  artworkId: string;
}

export class UserBlogRefDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  blogId: string;
}
