import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsString } from "class-validator";
import { CategoryCreateDto } from "./categories-create.dto";

export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
  @IsString()
  @IsMongoId()
  categoryID: string;
}
