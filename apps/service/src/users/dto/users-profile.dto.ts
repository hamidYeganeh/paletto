import { IsOptional, IsString } from "class-validator";

export class UserProfileUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
