import { Transform } from "class-transformer";
import { IsIn, IsMongoId, IsNotEmpty } from "class-validator";
import { COMMENT_STATUSES } from "../enums/comment-status.enum";

export class UpdateCommentStatusDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  commentId: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty()
  @IsIn(COMMENT_STATUSES)
  status: string;
}
