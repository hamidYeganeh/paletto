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
import { MIN_LIST_LIMIT, MIN_LIST_PAGE } from "src/constants/default-list-params";
import { Types } from "mongoose";
import { ARTWORK_STATUSES } from "src/artworks/enums/artwork-status.enum";
import { IsMongoIdArray } from "src/common/is-mongo-id-array";
import { toObjectIdArray } from "src/common/transformers/to-object-id-array";
import { toStringArray } from "src/common/transformers/to-string-array";
import { MAX_TAG_LENGTH, MAX_TAGS } from "src/common/tags";

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
  @IsIn(ARTWORK_STATUSES)
  status?: string;

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "techniques must be an array of ObjectIds" })
  @IsOptional()
  techniques?: Types.ObjectId[];

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "styles must be an array of ObjectIds" })
  @IsOptional()
  styles?: Types.ObjectId[];

  @Transform(toObjectIdArray)
  @IsMongoIdArray({ message: "categories must be an array of ObjectIds" })
  @IsOptional()
  categories?: Types.ObjectId[];

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
  tags?: string[];
  isScheduled?: boolean;
  publishAt?: Date;
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
