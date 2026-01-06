import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import { Model, Types } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
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

    const blog = await this.blogModel.create({
      authorId: author._id,
      title: dto?.title.trim(),
      content: dto?.content.trim(),
      description: dto?.description.trim(),
      cover: dto?.cover,
      slug: dto?.slug,
      status,
      tags,
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
}
