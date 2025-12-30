import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {
  TAXONOMY_STATUSES,
  type TaxonomyStatus,
} from "src/common/enums/taxonomy-status.enum";

export class CreateStyleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsIn(TAXONOMY_STATUSES)
  @IsNotEmpty()
  status: TaxonomyStatus;
}
