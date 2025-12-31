import { Transform } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { IUserStatus } from "../enums/users-status.enum";

export class UpdateUserStatusDto {
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value
  )
  @IsEnum(IUserStatus)
  @IsNotEmpty()
  status: IUserStatus;
}
