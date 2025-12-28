import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArtworkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
