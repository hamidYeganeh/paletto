import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";
import { IBlogsStatus } from "../enums/blogs-status.enum";

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1_000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000)
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(IBlogsStatus)
  @IsOptional()
  status?: IBlogsStatus;

  @IsString()
  @IsNotEmpty()
  cover: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS)
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @IsOptional()
  tags?: string[];
}
