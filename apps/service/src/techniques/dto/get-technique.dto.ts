import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetTechniqueDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  techniqueId: string;
}
