import { Transform } from "class-transformer";
import { IsIn, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { TAXONOMY_STATUSES } from "src/common/enums/taxonomy-status.enum";

export class UpdateArtworkStatusDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  artworkId: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsString()
  @IsNotEmpty()
  @IsIn(TAXONOMY_STATUSES)
  status: string;
}
