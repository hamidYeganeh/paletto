import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsString } from "class-validator";
import { ArtworkCreateDto } from "./artworks-create.dto";

export class ArtworkUpdateDto extends PartialType(
  OmitType(ArtworkCreateDto, ["artistID"])
) {
  @IsString()
  @IsMongoId()
  artworkID: string;
}

