import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateExhibitionDto as CreateExhibitionDtoType, ExhibitionStatus } from '@workspace/shared';

export class CreateExhibitionDto implements CreateExhibitionDtoType {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  artworkIds?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ExhibitionStatus)
  status?: ExhibitionStatus;
}
