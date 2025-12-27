import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ListUsersService } from "../services/list-users.service";
import {
  UsersListQueryDto,
  UsersListResponseDto,
} from "../dto/users-list.dto";
import { RolesGuard } from "src/auth/guards/role.guards";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@UseGuards(JwtAuthGuard, RolesGuard)
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
