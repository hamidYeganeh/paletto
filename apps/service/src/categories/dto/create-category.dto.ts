import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {
  CATEGORY_STATUSES,
  type CategoryStatus,
} from "src/categories/enums/category-status.enum";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsIn(CATEGORY_STATUSES)
  @IsNotEmpty()
  status: CategoryStatus;
}
