import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";
import { toObjectIdArray } from "src/common/transformers/to-object-id-array";

export class ArtistCreateDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "techniques must be an array of ObjectIds" })
  @IsArray()
  @IsOptional()
  techniques?: Types.ObjectId[];

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "styles must be an array of ObjectIds" })
  @IsArray()
  @IsOptional()
  styles?: Types.ObjectId[];
}
