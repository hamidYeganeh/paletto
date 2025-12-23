import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/list-pagination.constants";
import { ArtworksStatus } from "../enums/artworks-status.enum";
import { ArtworkDocument } from "../schemas/artwork.schema";

export class ArtworksListQueryDto {
  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(DEFAULT_LIST_PAGE)
  page: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(DEFAULT_LIST_LIMIT)
  limit: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(ArtworksStatus)
  status?: ArtworksStatus;

  @IsOptional()
  @IsMongoId()
  artistID?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  categories?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  techniques?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mediums?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  materials?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tags?: string;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  minYear?: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  maxYear?: number;
}

export interface ArtworksListResponseDto {
  count: number;
  artworks: ArtworkDocument[];
}
