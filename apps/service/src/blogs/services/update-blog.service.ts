import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import {
  UserProfile,
  UserProfileDocument,
} from "src/users/schemas/users-profile.schema";
import { normalizeTags } from "src/common/tags";

@Injectable()
export class UpdateBlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>
  ) {}

  async execute(userId: string, dto: UpdateBlogDto) {
    const blogId = dto.blogId?.trim();

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      throw new BadRequestException("Invalid blog id");
    }

    const userObjectId = new Types.ObjectId(userId);

    const author = await this.userProfileModel.findOne({
      userId: userObjectId,
    });

    if (!author) {
      throw new NotFoundException("User profile not found");
    }

    const updatePayload: UpdateQuery<Blog> = {};
    const unsetPayload: Record<string, "" | 1> = {};

    if (dto.title !== undefined) {
      updatePayload.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      updatePayload.description = dto.description.trim();
    }

    if (dto.content !== undefined) {
      updatePayload.content = dto.content.trim();
    }

    if (dto.cover !== undefined) {
      updatePayload.cover = dto.cover.trim();
    }

    if (dto.slug !== undefined) {
      updatePayload.slug = dto.slug.trim();
    }

    if (dto.status !== undefined) {
      updatePayload.status = dto.status;
    }

    if (dto.tags !== undefined) {
      updatePayload.tags = normalizeTags(dto.tags);
    }

    if (dto.isScheduled !== undefined || dto.publishAt !== undefined) {
      const scheduleUpdate = this.resolveScheduleUpdate(
        dto.isScheduled,
        dto.publishAt
      );
      Object.assign(updatePayload, scheduleUpdate.set);
      Object.assign(unsetPayload, scheduleUpdate.unset);
    }

    const blogObjectId = new Types.ObjectId(blogId);

    const updateQuery: UpdateQuery<Blog> = { $set: updatePayload };
    if (Object.keys(unsetPayload).length) {
      updateQuery.$unset = unsetPayload;
    }

    const blog = await this.blogModel
      .findOneAndUpdate(
        {
          _id: blogObjectId,
          authorId: author._id,
        },
        updateQuery,
        { new: true, runValidators: true }
      )
      .exec();

    if (!blog) {
      throw new NotFoundException("Blog not found");
    }

    return blog;
  }

  private resolveScheduleUpdate(
    isScheduled?: boolean,
    publishAt?: string
  ): { set: UpdateQuery<Blog>; unset: Record<string, "" | 1> } {
    const set: UpdateQuery<Blog> = {};
    const unset: Record<string, "" | 1> = {};
    const hasPublishAt = publishAt !== undefined;

    if (isScheduled === true && !publishAt) {
      throw new BadRequestException(
        "publishAt is required when isScheduled is true"
      );
    }

    if (isScheduled === false && hasPublishAt) {
      throw new BadRequestException(
        "publishAt requires isScheduled to be true"
      );
    }

    if (hasPublishAt) {
      const publishAtDate = new Date(publishAt);
      if (Number.isNaN(publishAtDate.getTime())) {
        throw new BadRequestException("Invalid publishAt value");
      }
      set.publishAt = publishAtDate;
      if (isScheduled === undefined) {
        set.isScheduled = true;
      }
    }

    if (isScheduled !== undefined) {
      set.isScheduled = isScheduled;
      if (!isScheduled) {
        unset.publishAt = "";
      }
    }

    return { set, unset };
  }
}
