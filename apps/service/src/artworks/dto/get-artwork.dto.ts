import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class GetArtworkDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  artworkId: string;
}
