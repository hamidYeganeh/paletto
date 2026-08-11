import { IsObject, IsOptional, IsString } from 'class-validator';
import { UpsertArtistProfileDto as UpsertArtistProfileDtoType } from '@workspace/shared';

export class UpsertArtistProfileDto implements UpsertArtistProfileDtoType {
  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}
