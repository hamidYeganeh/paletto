import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import {
  MIN_LIST_LIMIT,
  MIN_LIST_PAGE,
} from "src/constants/default-list-params";
import { Types } from "mongoose";
import { IUserRoles } from "../enums/users-role.enum";
import { IUserStatus } from "../enums/users-status.enum";

const USER_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "email",
  "role",
  "status",
] as const;
const SORT_ORDERS = ["asc", "desc"] as const;

export type UserSortBy = (typeof USER_SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export class ListUsersQueryDto {
  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(MIN_LIST_PAGE)
  page?: number;

  @Transform(({ value }) => (value === "" ? undefined : value))
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(MIN_LIST_LIMIT)
  limit?: number;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsEnum(IUserStatus)
  status?: IUserStatus;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(USER_SORT_FIELDS)
  sortBy?: UserSortBy;

  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value
  )
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: SortOrder;
}

export interface ListUsersItemDto {
  _id: Types.ObjectId;
  email: string;
  role: IUserRoles;
  status: IUserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUsersResponseDto {
  count: number;
  users: ListUsersItemDto[];
}
