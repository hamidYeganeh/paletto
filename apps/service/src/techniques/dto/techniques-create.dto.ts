import { Transform } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { TechniquesStatus } from "../enums/techniques-status.enum";

export class TechniqueCreateDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @MinLength(4)
  @MaxLength(200)
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(TechniquesStatus)
  status: TechniquesStatus;

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

