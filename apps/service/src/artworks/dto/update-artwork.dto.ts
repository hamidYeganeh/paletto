import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";
import { toObjectIdArray } from "src/common/transformers/to-object-id-array";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";

export class UpdateArtworkDto {
  @IsString()
  @IsOptional()
  title?: string;

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

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean;

  @ValidateIf((dto) => dto.isScheduled === true)
  @IsDateString()
  @IsNotEmpty()
  publishAt?: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  artworkId: string;
}
