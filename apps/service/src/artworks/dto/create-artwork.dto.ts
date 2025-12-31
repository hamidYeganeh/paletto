import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";
import { toObjectIdArray } from "src/common/transformers/to-object-id-array";

export class CreateArtworkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

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

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "categories must be an array of ObjectIds" })
  @IsArray()
  @IsOptional()
  categories?: Types.ObjectId[];
}
