import { IsOptional, IsString } from 'class-validator';
import { CreateCategoryDto as CreateCategoryDtoType } from '@workspace/shared';

export class CreateCategoryDto implements CreateCategoryDtoType {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
