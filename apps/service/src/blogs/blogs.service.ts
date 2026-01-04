import { Injectable } from "@nestjs/common";
import { CreateBlogService } from "./services/create-blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogDocument } from "./schemas/blog.schema";
import { UpdateBlogService } from "./services/update-blog.service";
import {
  ListBlogsQueryDto,
  ListBlogsResponseDto,
} from "./dto/list-blogs.dto";
import { ListBlogsService } from "./services/list-blogs.service";
import { GetBlogDto } from "./dto/get-blog.dto";
import { GetBlogService } from "./services/get-blog.service";
import { UpdateBlogStatusDto } from "./dto/update-blog-status.dto";
import { UpdateBlogStatusService } from "./services/update-blog-status.service";

@Injectable()
export class BlogsService {
  constructor(
    private readonly createBlogsService: CreateBlogService,
    private readonly updateBlogsService: UpdateBlogService,
    private readonly listBlogsService: ListBlogsService,
    private readonly getBlogService: GetBlogService,
    private readonly updateBlogStatusService: UpdateBlogStatusService
  ) {}

  async listBlogs(
    dto: ListBlogsQueryDto
  ): Promise<ListBlogsResponseDto> {
    return this.listBlogsService.execute(dto);
  }

  async getBlog(dto: GetBlogDto): Promise<BlogDocument> {
    return this.getBlogService.execute(dto);
  }

  async createBlog(userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    return this.createBlogsService.execute(userId, dto);
  }

  async updateBlog(userId: string, dto: UpdateBlogDto): Promise<BlogDocument> {
    return this.updateBlogsService.execute(userId, dto);
  }

  async updateBlogStatus(dto: UpdateBlogStatusDto): Promise<BlogDocument> {
    return this.updateBlogStatusService.execute(dto);
  }
}
