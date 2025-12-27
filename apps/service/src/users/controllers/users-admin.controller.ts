import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UsersListService } from "../services/users-list.service";
import {
  UsersListQueryDto,
  UsersListResponseDto,
} from "../dto/users-list.dto";
import { RolesGuard } from "src/auth/guards/role.guards";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("admin/users")
export class UsersAdminControllers {
  constructor(private readonly usersListService: UsersListService) {}

  @Get("list")
  async getUsersList(
    @Query() query: UsersListQueryDto
  ): Promise<UsersListResponseDto> {
    return this.usersListService.execute(query);
  }
}
