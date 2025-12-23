import { Transform } from "class-transformer";
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { MediumStatus } from "../enums/mediums-status.enum";

export class MediumCreateDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @MinLength(4)
  @MaxLength(200)
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(MediumStatus)
  status: MediumStatus;

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

