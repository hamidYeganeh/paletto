import { Transform } from "class-transformer";
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  CATEGORY_STATUSES,
  type CategoryStatus,
} from "src/categories/enums/category-status.enum";

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsIn(CATEGORY_STATUSES)
  @IsOptional()
  status?: CategoryStatus;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;
}
