import {
  IsEnum,
  IsIn,
  IsMongoId,
  isMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { IBlogsStatus } from "../enums/blogs-status.enum";
import { Types } from "mongoose";

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
  @IsNotEmpty()
  status: IBlogsStatus;

  @IsString()
  @IsNotEmpty()
  cover: string;

  @IsString()
  @IsMongoId()
  authorId: Types.ObjectId;
}
