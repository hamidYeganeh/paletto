import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ROLES_KEY } from "../auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { User } from "src/users/schemas/users.schema";
import { IUserStatus } from "src/users/enums/users-status.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<IUserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (!authUser?.userId) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel
      .findById(authUser.userId)
      .select("role isActive")
      .lean();

    if (!user || user.status !== IUserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException();
    }

    request.currentUser = user;

    return true;
  }
}
