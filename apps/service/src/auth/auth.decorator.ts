import { IUserRoles } from "../users/enums/users-role.enum";

import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: IUserRoles[]) => SetMetadata(ROLES_KEY, roles);
