import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { GetBlogDto } from "../dto/get-blog.dto";
import { Blog, BlogDocument } from "../schemas/blog.schema";

@Injectable()
export class GetBlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(dto: GetBlogDto): Promise<BlogDocument> {
    const blogObjectId = this.toObjectId(dto.blogId, "Invalid blog id");

    const blog = await this.blogModel.findById(blogObjectId).exec();

    if (!blog) {
      throw new NotFoundException("Blog not found");
    }

    return blog;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
