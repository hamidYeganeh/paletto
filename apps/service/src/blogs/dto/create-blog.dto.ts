import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
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
  @IsNotEmpty()
  status: IBlogsStatus;

  @IsString()
  @IsNotEmpty()
  cover: string;
}
