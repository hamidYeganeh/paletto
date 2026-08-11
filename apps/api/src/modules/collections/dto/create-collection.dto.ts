import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CollectionVisibility, CreateCollectionDto as CreateCollectionDtoType } from '@workspace/shared';

export class CreateCollectionDto implements CreateCollectionDtoType {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CollectionVisibility)
  visibility?: CollectionVisibility;
}
