import { Transform, Type } from "class-transformer";
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { DEFAULT_LIST_PAGE } from "src/constants/default-list-params";
import { UserDocument } from "../schemas/users.schema";

export class UsersListQueryDto {
  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(DEFAULT_LIST_PAGE)
  page: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(DEFAULT_LIST_PAGE)
  limit: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}

export interface UsersListResponseDto {
  count: number;
  users: UserDocument[];
}
