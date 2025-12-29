import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ListUsersQueryDto,
  ListUsersResponseDto,
} from "../dto/list-users.dto";
import { UsersService } from "../users.service";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "../enums/users-role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/users")
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get("list")
  async listUsers(
    @Query() query: ListUsersQueryDto
  ): Promise<ListUsersResponseDto> {
    return this.usersService.listUsers(query);
  }
}
