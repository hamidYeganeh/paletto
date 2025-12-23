import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UsersArtistProfileUpdateDto {
  @IsOptional()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  techniques: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  styles: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mediums: string[];
}
