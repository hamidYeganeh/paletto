import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { UserProfileUpdateDto } from "../dto/users-profile.dto";
import { UsersService } from "../users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import type { AuthenticatedRequest } from "src/auth/types/authenticated-request";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("profile/update")
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserProfileUpdateDto
  ) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get("profile/get")
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.userId);
  }
}
