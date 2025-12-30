import { Transform } from "class-transformer";
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  TAXONOMY_STATUSES,
  type TaxonomyStatus,
} from "src/common/enums/taxonomy-status.enum";

export class UpdateTechniqueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsIn(TAXONOMY_STATUSES)
  @IsOptional()
  status?: TaxonomyStatus;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  techniqueId: string;
}
