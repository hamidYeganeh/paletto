import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateBlogStatusDto } from "../dto/update-blog-status.dto";
import { Blog, BlogDocument } from "../schemas/blog.schema";

@Injectable()
export class UpdateBlogStatusService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(dto: UpdateBlogStatusDto): Promise<BlogDocument> {
    const blogId = dto.blogId?.trim();
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      throw new BadRequestException("Invalid blog id");
    }

    const blog = await this.blogModel
      .findByIdAndUpdate(
        blogId,
        { $set: { status: dto.status } },
        { new: true, runValidators: true }
      )
      .exec();

    if (!blog) {
      throw new NotFoundException("Blog not found");
    }

    return blog;
  }
}
