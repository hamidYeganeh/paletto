import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";

const transformToObjectIdArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null) return [];

  const rawArray = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [value];

  return rawArray
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter((item) => item !== "")
    .map((item) => (Types.ObjectId.isValid(item) ? new Types.ObjectId(item) : item));
};

export class ArtistUpdateDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @Transform(transformToObjectIdArray)
  @IsMongoIdArray({ message: "techniques must be an array of ObjectIds" })
  @IsArray()
  @IsOptional()
  techniques?: Types.ObjectId[];

  @Transform(transformToObjectIdArray)
  @IsMongoIdArray({ message: "styles must be an array of ObjectIds" })
  @IsArray()
  @IsOptional()
  styles?: Types.ObjectId[];
}
