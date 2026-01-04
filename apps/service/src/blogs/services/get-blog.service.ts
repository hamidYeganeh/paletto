import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFilter, Types } from "mongoose";
import { GetBlogDto } from "../dto/get-blog.dto";
import { Blog, BlogDocument } from "../schemas/blog.schema";
import { IBlogsStatus } from "../enums/blogs-status.enum";

@Injectable()
export class GetBlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>
  ) {}

  async execute(
    dto: GetBlogDto,
    options: { publicOnly?: boolean } = {}
  ): Promise<BlogDocument> {
    const blogObjectId = this.toObjectId(dto.blogId, "Invalid blog id");

    const filters = this.buildFilters(blogObjectId, options);

    const blog = await this.blogModel.findOne(filters).exec();

    if (!blog) {
      throw new NotFoundException("Blog not found");
    }

    return blog;
  }

  private buildFilters(
    blogId: Types.ObjectId,
    options: { publicOnly?: boolean }
  ): QueryFilter<BlogDocument> {
    const filters: QueryFilter<BlogDocument> = { _id: blogId };

    if (options.publicOnly) {
      filters.status = IBlogsStatus.ACTIVE;
      filters.$and = [
        {
          $or: [
            { isScheduled: { $ne: true } },
            { publishAt: { $lte: new Date() } },
          ],
        },
      ];
    }

    return filters;
  }

  private toObjectId(value: string, errorMessage: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(errorMessage);
    }

    return new Types.ObjectId(value);
  }
}
