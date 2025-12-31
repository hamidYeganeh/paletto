import { Transform } from "class-transformer";
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  STYLE_STATUSES,
  type StyleStatus,
} from "src/styles/enums/style-status.enum";

export class UpdateStyleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsIn(STYLE_STATUSES)
  @IsOptional()
  status?: StyleStatus;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  styleId: string;
}
