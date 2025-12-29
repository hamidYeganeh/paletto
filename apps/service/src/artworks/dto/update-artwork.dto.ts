import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateArtworkDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  artworkId: string;
}
