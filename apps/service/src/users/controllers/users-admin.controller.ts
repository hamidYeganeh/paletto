import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ListUsersService } from "../services/list-users.service";
import {
  UsersListQueryDto,
  UsersListResponseDto,
} from "../dto/users-list.dto";
import { RolesGuard } from "src/auth/guards/role.guards";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "../enums/users-role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/users")
export class UsersAdminController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get("list")
  async getUsersList(
    @Query() query: UsersListQueryDto
  ): Promise<UsersListResponseDto> {
    return this.listUsersService.execute(query);
  }
}
