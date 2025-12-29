import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetArtworkDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  artworkId: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  artistId: string;
}
