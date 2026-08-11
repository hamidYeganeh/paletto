import { IsEnum, IsOptional } from 'class-validator';
import { ArtworkStatus, UpdateArtworkDto as UpdateArtworkDtoType } from '@workspace/shared';
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtworkDto } from './create-artwork.dto';

export class UpdateArtworkDto extends PartialType(CreateArtworkDto) implements UpdateArtworkDtoType {
  @IsOptional()
  @IsEnum(ArtworkStatus)
  status?: ArtworkStatus;
}
