import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { UserRoles } from "../enums/users-roles.enum";

export class UserCreateDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @IsEmail()
  @MaxLength(200)
  email: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  password: string;

  @IsEnum(UserRoles)
  role: UserRoles;
}
