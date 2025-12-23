import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";

export class PriceRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;
}

export class UsersUserProfileUpdateDto {
  @IsOptional()
  @IsBoolean()
  hasBoughtBefore?: boolean;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  favoriteArtworks?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  favoriteCategories?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  favoriteTechniques?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceRangeDto)
  preferredPriceRange?: PriceRangeDto;
}
