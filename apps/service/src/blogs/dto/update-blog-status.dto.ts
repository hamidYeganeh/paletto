import { Transform } from "class-transformer";
import { IsIn, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { BLOG_STATUSES } from "../enums/blogs-status.enum";

export class UpdateBlogStatusDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  blogId: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsString()
  @IsNotEmpty()
  @IsIn(BLOG_STATUSES)
  status: string;
}
