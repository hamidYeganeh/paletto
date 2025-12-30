import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import {
  MIN_LIST_LIMIT,
  MIN_LIST_PAGE,
} from "src/constants/default-list-params";
import { Types } from "mongoose";
import { TAXONOMY_STATUSES } from "src/common/enums/taxonomy-status.enum";

const TECHNIQUE_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "slug",
] as const;
const SORT_ORDERS = ["asc", "desc"] as const;

export type TechniqueSortBy = (typeof TECHNIQUE_SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export class ListTechniquesQueryDto {
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
  @IsIn(TAXONOMY_STATUSES)
  status?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(TECHNIQUE_SORT_FIELDS)
  sortBy?: TechniqueSortBy;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}

export interface TechniqueListItemDto {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListTechniquesResponseDto {
  count: number;
  techniques: TechniqueListItemDto[];
}
