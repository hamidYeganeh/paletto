import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { UpdateUserDto as UpdateUserDtoType } from '@workspace/shared';

export class UpdateUserDto implements UpdateUserDtoType {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;
}
