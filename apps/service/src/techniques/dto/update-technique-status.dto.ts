import { Transform } from "class-transformer";
import { IsIn, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { TECHNIQUE_STATUSES } from "src/techniques/enums/technique-status.enum";

export class UpdateTechniqueStatusDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  techniqueId: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsString()
  @IsNotEmpty()
  @IsIn(TECHNIQUE_STATUSES)
  status: string;
}
