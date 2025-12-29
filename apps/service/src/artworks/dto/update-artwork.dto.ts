import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateArtworkDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsNotEmpty()
  artworkId: string;
}
