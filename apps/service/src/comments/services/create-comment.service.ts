import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { Comment, CommentDocument } from "../schemas/comment.schema";
import {
  UserProfile,
  UserProfileDocument,
} from "src/users/schemas/users-profile.schema";
import { CommentTargetType } from "../enums/comment-target.enum";
import { Artwork, ArtworkDocument } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogDocument } from "src/blogs/schemas/blog.schema";
import { ArtworkStatus } from "src/artworks/enums/artwork-status.enum";
import { IBlogsStatus } from "src/blogs/enums/blogs-status.enum";

@Injectable()
export class CreateCommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>,
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(userId: string, dto: CreateCommentDto) {
    const userObjectId = new Types.ObjectId(userId);
    const targetObjectId = this.toObjectId(dto.targetId, "Invalid target id");

    const profile = await this.userProfileModel
      .findOne({ userId: userObjectId })
      .exec();

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    await this.ensureTargetVisible(dto.targetType, targetObjectId);

    const targetModel = this.resolveTargetModel(dto.targetType);

    const comment = await this.commentModel.create({
      targetType: dto.targetType,
      targetModel,
      targetId: targetObjectId,
      authorId: profile._id,
      content: dto.content.trim(),
    });

    const profileField =
      dto.targetType === CommentTargetType.ARTWORK
        ? "commentedArtworks"
        : "commentedBlogs";

    await this.userProfileModel
      .findByIdAndUpdate(profile._id, {
        $addToSet: { [profileField]: targetObjectId },
      })
      .exec();

    return comment;
  }

  private resolveTargetModel(type: CommentTargetType): string {
    return type === CommentTargetType.ARTWORK ? Artwork.name : Blog.name;
  }

  private async ensureTargetVisible(
    type: CommentTargetType,
    targetId: Types.ObjectId
  ) {
    if (type === CommentTargetType.ARTWORK) {
      const exists = await this.artworkModel.exists({
        _id: targetId,
        status: ArtworkStatus.ACTIVE,
      });

      if (!exists) {
        throw new NotFoundException("Artwork not found");
      }

      return;
    }

    const exists = await this.blogModel.exists({
      _id: targetId,
      status: IBlogsStatus.ACTIVE,
    });

    if (!exists) {
      throw new NotFoundException("Blog not found");
    }
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
