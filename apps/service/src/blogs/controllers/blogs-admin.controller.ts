import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BlogsService } from "../blogs.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { type AuthenticatedRequest } from "src/auth/types/authenticated-request";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import { BlogDocument } from "../schemas/blog.schema";
import { UpdateBlogStatusDto } from "../dto/update-blog-status.dto";
import { ListBlogsQueryDto } from "../dto/list-blogs.dto";
import { GetBlogDto } from "../dto/get-blog.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IUserRoles.ADMIN)
@Controller("admin/blogs")
export class BlogsAdminController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get("list")
  async listBlogs(@Query() query: ListBlogsQueryDto) {
    return this.blogsService.listBlogs(query);
  }

  @Post("get")
  async getBlog(@Body() dto: GetBlogDto): Promise<BlogDocument> {
    return this.blogsService.getBlog(dto);
  }

  @Post("create")
  async createBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBlogDto
  ): Promise<BlogDocument> {
    return this.blogsService.createBlog(req.user.userId, dto);
  }

  @Patch("update")
  async updateBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateBlogDto
  ): Promise<BlogDocument> {
    return this.blogsService.updateBlog(req.user.userId, dto);
  }

  @Patch("update-status")
  async updateBlogStatus(
    @Body() dto: UpdateBlogStatusDto
  ): Promise<BlogDocument> {
    return this.blogsService.updateBlogStatus(dto);
  }
}
