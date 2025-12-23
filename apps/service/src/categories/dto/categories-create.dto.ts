import { Transform } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { CategoriesStatus } from "../enums/categories-status.enum";

export class CategoryCreateDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @MinLength(4)
  @MaxLength(200)
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(CategoriesStatus)
  status: CategoriesStatus;

  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string;
}
