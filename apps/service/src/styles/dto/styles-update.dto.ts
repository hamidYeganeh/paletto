import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsString } from "class-validator";
import { StyleCreateDto } from "./styles-create.dto";

export class StyleUpdateDto extends PartialType(StyleCreateDto) {
  @IsString()
  @IsMongoId()
  styleID: string;
}

