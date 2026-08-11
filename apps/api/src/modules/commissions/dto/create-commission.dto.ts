import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateCommissionDto as CreateCommissionDtoType } from '@workspace/shared';

export class CreateCommissionDto implements CreateCommissionDtoType {
  @IsString()
  artistId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  referenceImages?: string[];
}
