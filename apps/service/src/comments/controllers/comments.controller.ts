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
import { CommentsService } from "../comments.service";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { ListCommentsQueryDto } from "../dto/list-comments.dto";
import { UpdateCommentStatusDto } from "../dto/update-comment-status.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import type { AuthenticatedRequest } from "src/auth/types/authenticated-request";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get("list")
  async listComments(@Query() query: ListCommentsQueryDto) {
    return this.commentsService.listComments(query, { publicOnly: true });
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCommentDto
  ) {
    return this.commentsService.createComment(req.user.userId, dto);
  }

  @Patch("update-status")
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateCommentStatusDto
  ) {
    return this.commentsService.updateCommentStatus(req.user.userId, dto);
  }
}
