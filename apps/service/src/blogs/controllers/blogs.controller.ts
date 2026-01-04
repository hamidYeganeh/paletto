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
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/auth.decorator";
import { IUserRoles } from "src/users/enums/users-role.enum";
import type { AuthenticatedRequest } from "src/auth/types/authenticated-request";
import { BlogsService } from "../blogs.service";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { GetBlogDto } from "../dto/get-blog.dto";
import { ListBlogsQueryDto } from "../dto/list-blogs.dto";
import { UpdateBlogDto } from "../dto/update-blog.dto";

const PUBLIC_BLOG_STATUS = "active";

@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get("list")
  async listBlogs(@Query() query: ListBlogsQueryDto) {
    return this.blogsService.listBlogs({
      ...query,
      status: PUBLIC_BLOG_STATUS,
    }, { publicOnly: true });
  }

  @Post("get")
  async getBlog(@Body() dto: GetBlogDto) {
    return this.blogsService.getBlog(dto, { publicOnly: true });
  }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(IUserRoles.ARTIST)
  async createBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBlogDto
  ) {
    return this.blogsService.createBlog(req.user.userId, dto);
  }

  @Patch("update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(IUserRoles.ARTIST)
  async updateBlog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateBlogDto
  ) {
    return this.blogsService.updateBlog(req.user.userId, dto);
  }
}
