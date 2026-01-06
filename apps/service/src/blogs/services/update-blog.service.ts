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

    const blogObjectId = new Types.ObjectId(blogId);

    const updateQuery: UpdateQuery<Blog> = { $set: updatePayload };

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
}
