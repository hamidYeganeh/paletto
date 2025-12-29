import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { MIN_LIST_LIMIT, MIN_LIST_PAGE } from "src/constants/default-list-params";
import { Types } from "mongoose";

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
}

export interface ArtistProfileDto {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  displayName?: string;
  techniques: Types.ObjectId[];
  styles: Types.ObjectId[];
}

export interface ArtworkListItemDto {
  _id: Types.ObjectId;
  artist?: ArtistProfileDto;
  title: string;
  description?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ListArtworksResponseDto {
  count: number;
  artworks: ArtworkListItemDto[];
}
