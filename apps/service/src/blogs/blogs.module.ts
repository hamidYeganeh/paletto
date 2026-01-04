import { Module } from "@nestjs/common";
import { BlogsController } from "./controllers/blogs.controller";
import { BlogsService } from "./blogs.service";
import { BlogsAdminController } from "./controllers/blogs-admin.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blog.schema";
import { UsersModule } from "src/users/users.module";
import { CreateBlogService } from "./services/create-blog.service";
import { UpdateBlogService } from "./services/update-blog.service";
import { ListBlogsService } from "./services/list-blogs.service";
import { GetBlogService } from "./services/get-blog.service";
import { UpdateBlogStatusService } from "./services/update-blog-status.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogsController, BlogsAdminController],
  providers: [
    BlogsService,
    CreateBlogService,
    UpdateBlogService,
    ListBlogsService,
    GetBlogService,
    UpdateBlogStatusService,
  ],
})
export class BlogsModule {}
