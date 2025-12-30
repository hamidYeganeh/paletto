import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetCategoryDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;
}
