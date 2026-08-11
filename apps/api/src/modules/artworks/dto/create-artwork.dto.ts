import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ArtworkMedium, CreateArtworkDto as CreateArtworkDtoType } from '@workspace/shared';

export class CreateArtworkDto implements CreateArtworkDtoType {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ArtworkMedium)
  medium!: ArtworkMedium;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  depth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @IsBoolean()
  isFramed?: boolean;
}
