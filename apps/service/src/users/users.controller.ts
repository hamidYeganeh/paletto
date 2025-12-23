import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersListQueryDto, UsersListResponseDto } from "./dto/users-list.dto";
import { UsersService } from "./users.service";
import { UserCreateDto } from "./dto/users-create.dto";
import { UserDocument } from "./schemas/users.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserUpdateDto } from "./dto/users-update.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("list")
  async getUsersList(
    @Query() query: UsersListQueryDto
  ): Promise<UsersListResponseDto> {
    return this.usersService.getUsersList(query);
  }

  @Post("create")
  async createUser(@Body() dto: UserCreateDto): Promise<UserDocument> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update")
  async updateUser(@Req() req, @Body() dto: UserUpdateDto) {
    return this.usersService.updateUser(req.user.id, dto);
  }
}
