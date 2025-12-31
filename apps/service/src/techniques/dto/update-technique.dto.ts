import { Transform } from "class-transformer";
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  TECHNIQUE_STATUSES,
  type TechniqueStatus,
} from "src/techniques/enums/technique-status.enum";

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

  @IsIn(TECHNIQUE_STATUSES)
  @IsOptional()
  status?: TechniqueStatus;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  techniqueId: string;
}
