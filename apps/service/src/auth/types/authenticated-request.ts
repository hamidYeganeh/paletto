import { Request } from "express";
import { Types } from "mongoose";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { IUserStatus } from "src/users/enums/users-status.enum";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
  currentUser?: {
    _id: Types.ObjectId;
    role: IUserRoles;
    status: IUserStatus;
  };
}
