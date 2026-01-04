import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import {
  ListCommentsQueryDto,
  ListCommentsResponseDto,
} from "./dto/list-comments.dto";
import { UpdateCommentStatusDto } from "./dto/update-comment-status.dto";
import { CreateCommentService } from "./services/create-comment.service";
import {
  ListCommentsOptions,
  ListCommentsService,
} from "./services/list-comments.service";
import {
  UpdateCommentStatusOptions,
  UpdateCommentStatusService,
} from "./services/update-comment-status.service";

@Injectable()
export class CommentsService {
  constructor(
    private readonly createCommentService: CreateCommentService,
    private readonly listCommentsService: ListCommentsService,
    private readonly updateCommentStatusService: UpdateCommentStatusService
  ) {}

  async createComment(userId: string, dto: CreateCommentDto) {
    return this.createCommentService.execute(userId, dto);
  }

  async listComments(
    dto: ListCommentsQueryDto,
    options?: ListCommentsOptions
  ): Promise<ListCommentsResponseDto> {
    return this.listCommentsService.execute(dto, options);
  }

  async updateCommentStatus(
    userId: string,
    dto: UpdateCommentStatusDto,
    options?: UpdateCommentStatusOptions
  ) {
    return this.updateCommentStatusService.execute(userId, dto, options);
  }
}
