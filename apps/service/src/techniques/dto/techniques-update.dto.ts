import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsString } from "class-validator";
import { TechniqueCreateDto } from "./techniques-create.dto";

export class TechniqueUpdateDto extends PartialType(TechniqueCreateDto) {
  @IsString()
  @IsMongoId()
  techniqueID: string;
}

