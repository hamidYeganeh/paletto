import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { Types } from "mongoose";
import {
  MIN_LIST_LIMIT,
  MIN_LIST_PAGE,
} from "src/constants/default-list-params";
import { BLOG_STATUSES } from "../enums/blogs-status.enum";
import { toStringArray } from "src/common/transformers/to-string-array";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";

const BLOG_SORT_FIELDS = ["createdAt", "updatedAt", "title", "slug"] as const;
const SORT_ORDERS = ["asc", "desc"] as const;

export type BlogSortBy = (typeof BLOG_SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export class ListBlogsQueryDto {
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

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsString()
  @IsOptional()
  @MaxLength(200)
  search?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(BLOG_STATUSES)
  status?: string;

  @Transform(toStringArray)
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS)
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @IsOptional()
  tags?: string[];

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(BLOG_SORT_FIELDS)
  sortBy?: BlogSortBy;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}

export interface BlogListItemDto {
  _id: Types.ObjectId;
  title: string;
  description: string;
  slug: string;
  status: string;
  cover: string;
  tags?: string[];
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListBlogsResponseDto {
  count: number;
  blogs: BlogListItemDto[];
}
