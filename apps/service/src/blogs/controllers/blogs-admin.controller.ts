import { Controller, Patch, Post } from "@nestjs/common";
import { BlogsService } from "../blogs.service";

@Controller("admin/blogs")
export class BlogsAdminController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post("create")
  async createBlog() {
    return this.blogsService.createBlog();
  }

  @Patch("update")
  async updateBlog() {
    return this.blogsService.updateBlog();
  }
}
