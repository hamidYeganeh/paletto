import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import { Model, Types } from "mongoose";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBlogDto } from "../dto/create-blog.dto";
import {
  UserProfile,
  type UserProfileDocument,
} from "src/users/schemas/users-profile.schema";
import { IBlogsStatus } from "../enums/blogs-status.enum";
import { normalizeTags } from "src/common/tags";

@Injectable()
export class CreateBlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfileDocument>
  ) {}

  async execute(userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    const userObjectId = new Types.ObjectId(userId);

    const author = await this.userProfileModel
      .findOne({ userId: userObjectId })
      .exec();

    if (!author) {
      throw new NotFoundException("User profile not found");
    }

    const status = dto.status ?? IBlogsStatus.DRAFT;
    const tags = normalizeTags(dto.tags);
    const schedule = this.resolveSchedule(dto.isScheduled, dto.publishAt);

    const blog = await this.blogModel.create({
      authorId: author._id,
      title: dto?.title.trim(),
      content: dto?.content.trim(),
      description: dto?.description.trim(),
      cover: dto?.cover,
      slug: dto?.slug,
      status,
      tags,
      ...schedule,
    });

    await this.userProfileModel
      .findByIdAndUpdate(author._id, {
        $addToSet: {
          blogs: blog._id,
        },
      })
      .exec();

    return blog;
  }

  private resolveSchedule(
    isScheduled?: boolean,
    publishAt?: string
  ): { isScheduled: boolean; publishAt?: Date } {
    const shouldSchedule = isScheduled ?? false;

    if (shouldSchedule && !publishAt) {
      throw new BadRequestException(
        "publishAt is required when isScheduled is true"
      );
    }

    if (!shouldSchedule && publishAt) {
      throw new BadRequestException(
        "publishAt requires isScheduled to be true"
      );
    }

    if (!shouldSchedule) {
      return { isScheduled: false, publishAt: undefined };
    }

    if (!publishAt) {
      throw new BadRequestException("publishAt is required");
    }

    const publishAtDate = new Date(publishAt);

    if (Number.isNaN(publishAtDate.getTime())) {
      throw new BadRequestException("Invalid publishAt value");
    }

    return { isScheduled: true, publishAt: publishAtDate };
  }
}
