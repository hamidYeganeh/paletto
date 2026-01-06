import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";
import { IBlogsStatus } from "../enums/blogs-status.enum";

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1_000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10_000)
  content?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsEnum(IBlogsStatus)
  @IsOptional()
  status?: IBlogsStatus;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS)
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @IsOptional()
  tags?: string[];

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  blogId: string;
}
