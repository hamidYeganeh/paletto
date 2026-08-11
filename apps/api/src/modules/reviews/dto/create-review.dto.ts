import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CreateReviewDto as CreateReviewDtoType } from '@workspace/shared';

export class CreateReviewDto implements CreateReviewDtoType {
  @IsString()
  targetId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
