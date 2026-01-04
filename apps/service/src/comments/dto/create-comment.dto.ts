import { Transform } from "class-transformer";
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { CommentTargetType } from "../enums/comment-target.enum";

export class CreateCommentDto {
  @IsEnum(CommentTargetType)
  @IsNotEmpty()
  targetType: CommentTargetType;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsNotEmpty()
  targetId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
