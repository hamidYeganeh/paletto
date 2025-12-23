import { Transform } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { StylesStatus } from "../enums/styles-status.enum";

export class StyleCreateDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @MinLength(4)
  @MaxLength(200)
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(StylesStatus)
  status: StylesStatus;

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

