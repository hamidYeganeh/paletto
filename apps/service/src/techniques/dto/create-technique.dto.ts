import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {
  TECHNIQUE_STATUSES,
  type TechniqueStatus,
} from "src/techniques/enums/technique-status.enum";

export class CreateTechniqueDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsIn(TECHNIQUE_STATUSES)
  @IsNotEmpty()
  status: TechniqueStatus;
}
