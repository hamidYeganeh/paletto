import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "../comments.service";
import { ListCommentsQueryDto } from "../dto/list-comments.dto";
import { UpdateCommentStatusDto } from "../dto/update-comment-status.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import type { AuthenticatedRequest } from "src/auth/types/authenticated-request";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/comments")
export class CommentsAdminController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get("list")
  async listComments(@Query() query: ListCommentsQueryDto) {
    return this.commentsService.listComments(query);
  }

  @Patch("update-status")
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCommentStatusDto
  ) {
    return this.commentsService.updateCommentStatus(req.user.userId, dto, {
      isAdmin: true,
    });
  }
}
