import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {
  STYLE_STATUSES,
  type StyleStatus,
} from "src/styles/enums/style-status.enum";

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

  @IsIn(STYLE_STATUSES)
  @IsNotEmpty()
  status: StyleStatus;
}
