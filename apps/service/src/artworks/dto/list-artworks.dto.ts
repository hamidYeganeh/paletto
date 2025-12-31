import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { MIN_LIST_LIMIT, MIN_LIST_PAGE } from "src/constants/default-list-params";
import { Types } from "mongoose";
import { TAXONOMY_STATUSES } from "src/common/enums/taxonomy-status.enum";

const ARTWORK_SORT_FIELDS = ["createdAt", "updatedAt", "title"] as const;
const SORT_ORDERS = ["asc", "desc"] as const;

export type ArtworkSortBy = (typeof ARTWORK_SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export class ListArtworksQueryDto {
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
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @IsIn(TAXONOMY_STATUSES)
  status?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(ARTWORK_SORT_FIELDS)
  sortBy?: ArtworkSortBy;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}

export interface ArtistProfileDto {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  displayName?: string;
  techniques: Types.ObjectId[];
  styles: Types.ObjectId[];
}

export interface TaxonomyListItemDto {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  status: string;
}

export interface ArtworkListItemDto {
  _id: Types.ObjectId;
  artist?: ArtistProfileDto;
  title: string;
  description?: string;
  images?: string[];
  status?: string;
  techniques?: TaxonomyListItemDto[];
  styles?: TaxonomyListItemDto[];
  categories?: TaxonomyListItemDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ListArtworksResponseDto {
  count: number;
  artworks: ArtworkListItemDto[];
}
