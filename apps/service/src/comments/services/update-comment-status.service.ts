import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateCommentStatusDto } from "../dto/update-comment-status.dto";
import { Comment, CommentDocument } from "../schemas/comment.schema";
import { CommentTargetType } from "../enums/comment-target.enum";
import { Artwork, ArtworkDocument } from "src/artworks/schemas/artwork.schema";
import { Blog, BlogDocument } from "src/blogs/schemas/blog.schema";
import { Artist, ArtistDocument } from "src/users/schemas/artists-profile.schema";
import {
  UserProfile,
  UserProfileDocument,
} from "src/users/schemas/users-profile.schema";

export interface UpdateCommentStatusOptions {
  isAdmin?: boolean;
}

@Injectable()
export class UpdateCommentStatusService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Artwork.name)
    private readonly artworkModel: Model<ArtworkDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>
  ) {}

  async execute(
    userId: string,
    dto: UpdateCommentStatusDto,
    options: UpdateCommentStatusOptions = {}
  ) {
    const commentObjectId = this.toObjectId(
      dto.commentId,
      "Invalid comment id"
    );

    const comment = await this.commentModel
      .findById(commentObjectId)
      .exec();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (!options.isAdmin) {
      const isOwner = await this.isTargetOwner(userId, comment);
      if (!isOwner) {
        throw new ForbiddenException();
      }
    }

    const updated = await this.commentModel
      .findByIdAndUpdate(
        commentObjectId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!updated) {
      throw new NotFoundException("Comment not found");
    }

    return updated;
  }

  private async isTargetOwner(userId: string, comment: CommentDocument) {
    const userObjectId = new Types.ObjectId(userId);

    if (comment.targetType === CommentTargetType.ARTWORK) {
      const artist = await this.artistModel
        .findOne({ userId: userObjectId })
        .select("_id")
        .lean()
        .exec();

      if (!artist) {
        return false;
      }

      const artwork = await this.artworkModel
        .findById(comment.targetId)
        .select("artistId")
        .lean()
        .exec();

      return (
        !!artwork && artwork.artistId?.toString() === artist._id.toString()
      );
    }

    const profile = await this.userProfileModel
      .findOne({ userId: userObjectId })
      .select("_id")
      .lean()
      .exec();

    if (!profile) {
      return false;
    }

    const blog = await this.blogModel
      .findById(comment.targetId)
      .select("authorId")
      .lean()
      .exec();

    return !!blog && blog.authorId?.toString() === profile._id.toString();
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
