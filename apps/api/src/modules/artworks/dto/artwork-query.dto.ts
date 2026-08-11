import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ArtworkQueryDto as ArtworkQueryDtoType, ArtworkStatus } from '@workspace/shared';

export class ArtworkQueryDto implements ArtworkQueryDtoType {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tagId?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ArtworkStatus)
  status?: ArtworkStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
