import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter, Types } from "mongoose";
import {
  ListCommentsQueryDto,
  ListCommentsResponseDto,
} from "../dto/list-comments.dto";
import { Comment, CommentDocument } from "../schemas/comment.schema";
import { CommentStatus } from "../enums/comment-status.enum";
import { CommentTargetType } from "../enums/comment-target.enum";
import {
  DEFAULT_LIST_LIMIT,
  DEFAULT_LIST_PAGE,
} from "src/constants/default-list-params";
import { Artwork, ArtworkDocument } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogDocument } from "src/blogs/schemas/blog.schema";
import { ArtworkStatus } from "src/artworks/enums/artwork-status.enum";
import { IBlogsStatus } from "src/blogs/enums/blogs-status.enum";

export interface ListCommentsOptions {
  publicOnly?: boolean;
}

@Injectable()
export class ListCommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(
    query: ListCommentsQueryDto,
    options: ListCommentsOptions = {}
  ): Promise<ListCommentsResponseDto> {
    if (options.publicOnly) {
      this.ensurePublicQuery(query);
      await this.ensureTargetVisible(
        query.targetType as CommentTargetType,
        new Types.ObjectId(query.targetId)
      );
    }

    const page = query.page ?? DEFAULT_LIST_PAGE;
    const limit = query.limit ?? DEFAULT_LIST_LIMIT;
    const filters = this.buildFilters(query, options);
    const sortOrder = query.sortOrder ?? "desc";
    const skip = Math.max(0, page - 1) * limit;

    const [count, comments] = await Promise.all([
      this.commentModel.countDocuments(filters).exec(),
      this.commentModel
        .find(filters)
        .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      count,
      comments: comments.map((comment) => ({
        _id: comment._id.toString(),
        targetType: comment.targetType,
        targetId: comment.targetId.toString(),
        authorId: comment.authorId.toString(),
        content: comment.content,
        status: comment.status,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
    };
  }

  private buildFilters(
    query: ListCommentsQueryDto,
    options: ListCommentsOptions
  ): QueryFilter<CommentDocument> {
    const filters: QueryFilter<CommentDocument> = {};

    if (query.targetType) {
      filters.targetType = query.targetType;
    }

    if (query.targetId) {
      filters.targetId = new Types.ObjectId(query.targetId);
    }

    if (options.publicOnly) {
      filters.status = CommentStatus.APPROVED;
    } else if (query.status?.trim()) {
      filters.status = query.status.trim();
    }

    return filters;
  }

  private ensurePublicQuery(query: ListCommentsQueryDto) {
    if (!query.targetType || !query.targetId) {
      throw new BadRequestException(
        "targetType and targetId are required"
      );
    }

    if (!Types.ObjectId.isValid(query.targetId)) {
      throw new BadRequestException("Invalid target id");
    }
  }

  private async ensureTargetVisible(
    type: CommentTargetType,
    targetId: Types.ObjectId
  ) {
    if (type === CommentTargetType.ARTWORK) {
      const exists = await this.artworkModel.exists({
        _id: targetId,
        status: ArtworkStatus.ACTIVE,
        ...this.buildScheduleFilter(),
      });

      if (!exists) {
        throw new NotFoundException("Artwork not found");
      }

      return;
    }

    const exists = await this.blogModel.exists({
      _id: targetId,
      status: IBlogsStatus.ACTIVE,
      ...this.buildScheduleFilter(),
    });

    if (!exists) {
      throw new NotFoundException("Blog not found");
    }
  }

  private buildScheduleFilter() {
    return {
      $or: [
        { isScheduled: { $ne: true } },
        { publishAt: { $lte: new Date() } },
      ],
    };
  }
}
