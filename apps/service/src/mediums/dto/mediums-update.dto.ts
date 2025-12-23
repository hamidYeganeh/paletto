import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsString } from "class-validator";
import { MediumCreateDto } from "./mediums-create.dto";

export class MediumUpdateDto extends PartialType(MediumCreateDto) {
  @IsString()
  @IsMongoId()
  mediumID: string;
}

