import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Types } from "mongoose";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";
import { toObjectIdArray } from "src/common/transformers/to-object-id-array";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";
import { ArtworkStatus } from "../enums/artwork-status.enum";

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

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS)
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(ArtworkStatus)
  @IsOptional()
  status?: ArtworkStatus;
}
