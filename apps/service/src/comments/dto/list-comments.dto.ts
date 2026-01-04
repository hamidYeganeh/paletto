import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  Min,
} from "class-validator";
import { MIN_LIST_LIMIT, MIN_LIST_PAGE } from "src/constants/default-list-params";
import { CommentTargetType } from "../enums/comment-target.enum";
import { COMMENT_STATUSES } from "../enums/comment-status.enum";

const SORT_ORDERS = ["asc", "desc"] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export class ListCommentsQueryDto {
  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(MIN_LIST_PAGE)
  page?: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(MIN_LIST_LIMIT)
  limit?: number;

  @IsEnum(CommentTargetType)
  @IsOptional()
  targetType?: CommentTargetType;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsMongoId()
  @IsOptional()
  targetId?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(COMMENT_STATUSES)
  status?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}

export interface CommentListItemDto {
  _id: string;
  targetType: CommentTargetType;
  targetId: string;
  authorId: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListCommentsResponseDto {
  count: number;
  comments: CommentListItemDto[];
}
